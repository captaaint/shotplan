# Shotplan — Angular Relearning Curriculum

A phased, module-based path that builds the Shotplan app (see `shotplan-angular-plan.md`) while relearning modern Angular (v21). Written for someone who knew pre-signals Angular: each phase highlights what changed.

## How to use this plan

- Do modules in order — each leaves the app in the state the next one needs.
- One module ≈ one sitting. Finish the verification checklist before moving on.
- Data strategy: in-memory → json-server mock API (Phase 4) → real Node.js server (Phase 6).
- Scope strategy: Clients, Sessions, Locations, Packages carry the lessons; remaining domains are repetition exercises in Phase 6.
- Current state: fresh `ng new` scaffold with SSR, placeholder template still in `app.html`.

---

## Phase 1: Modern Angular Fundamentals

Theme: templates and bindings, with the post-Angular-16 changes — standalone by default, new file naming (`app.ts`, not `app.component.ts`), built-in control flow instead of `*ngIf`/`*ngFor`.

### Module 1: Scaffold Tour & Static Shell
Concept: standalone component anatomy; no NgModules anymore
Generic Example: a minimal `@Component` with inline template and `imports: []`
Project Exercise: delete the placeholder in `app.html`; render a static "Shotplan" header and a hardcoded "Next session: Anna — Portrait — Saturday" line
Expected Outcome: the app shows your own content at `localhost:4200`
Verification:
- `app.html` contains no generated placeholder markup
- `App` class has no `NgModule` anywhere in the project (`app.config.ts` uses `ApplicationConfig`)
- `ng serve` runs clean

### Module 2: Interpolation & Property Binding
Concept: `{{ }}` interpolation and `[property]` binding from class fields
Generic Example: `<img [src]="imageUrl" [alt]="label">` driven by component fields
Project Exercise: define a hardcoded `session` object (client name, type, date, price, galleryUrl) in `App` and render it; bind `[href]` for the gallery link
Expected Outcome: session details on screen come from the class, not the template
Verification:
- a `Session`-shaped object literal exists in the component class
- template uses `{{ session.x }}` and at least one `[property]` binding
- changing a field value in the class changes the page

### Module 3: Built-in Control Flow
Concept: `@if`, `@for` with mandatory `track`, `@empty` — replaces `*ngIf`/`*ngFor`
Generic Example: `@for (item of items; track item.id) { … } @empty { <p>No items</p> }`
Project Exercise: replace the single session with a hardcoded `sessions: Session[]` array (4–5 entries, mixed statuses) rendered as a list; show an `@empty` message
Expected Outcome: a session list renders; emptying the array shows the empty state
Verification:
- no `*ngIf`/`*ngFor` in the codebase
- `@for` uses `track s.id`
- `@if` used at least once (e.g. only show gallery link when `galleryUrl` set)

### Module 4: Class & Style Bindings
Concept: `[class.x]`, `[style.x]`, and object syntax for conditional styling
Generic Example: `<span [class.active]="isActive">`
Project Exercise: add a status badge to each session row — different color per status (`inquiry`, `booked`, `done`) via class bindings; styles in `app.scss`
Expected Outcome: color-coded status badges in the list
Verification:
- badge classes are driven by data, not hardcoded per row
- at least one `[class.…]` or `[class]` object binding in the template
- statuses visibly differ on screen

---

## Phase 2: State with Signals

Theme: signals replace "fields + change detection magic" as the way to hold and derive state. Biggest conceptual shift since pre-signals Angular.

### Module 5: Writable Signals & Events
Concept: `signal()` for changing state; `(click)` handlers call `.set()`
Generic Example: counter — `count = signal(0)`, button calls `count.set(count() + 1)`
Project Exercise: add `selectedSessionId = signal<string | null>(null)`; clicking a session row selects it; render a detail panel for the selected session
Expected Outcome: clicking rows switches the detail panel
Verification:
- `selectedSessionId` is a signal, read in the template as `selectedSessionId()`
- rows call a method that uses `.set()`
- clicked row gets a visual "selected" state (reuses Module 4 skills)

### Module 6: Computed Signals
Concept: `computed()` for derived state that recalculates automatically
Generic Example: `doubled = computed(() => this.count() * 2)`
Project Exercise: convert `sessions` to a signal; derive `selectedSession` (lookup by id), `upcomingCount`, and `bookedRevenue` (sum of price where status is `booked`); show the two stats above the list
Expected Outcome: header stats update automatically when data changes
Verification:
- `sessions` is `signal<Session[]>`
- detail panel reads `selectedSession()` instead of doing lookup in the template
- no manual recalculation calls anywhere

### Module 7: Immutable Updates
Concept: `.update()` with immutable patterns — replace arrays/objects, never mutate
Generic Example: `items.update(list => [...list, newItem])`
Project Exercise: add a "Mark done" button on the selected session and a quick "Add test session" button; both go through `sessions.update()` producing new arrays/objects
Expected Outcome: status changes and additions appear instantly, stats recompute
Verification:
- no `.push()` or direct property mutation on signal contents
- `bookedRevenue`/`upcomingCount` change when you mark a session done
- `.update()` used with spread/`map`

### Module 8: Effects
Concept: `effect()` for side effects — and why `computed` is usually the right tool instead
Generic Example: `effect(() => console.log(this.count()))`
Project Exercise: an effect that sets `document.title` to the selected session's client name (guard for SSR with `isPlatformBrowser` or `afterNextRender` awareness)
Expected Outcome: browser tab title follows the selection
Verification:
- exactly one `effect()`, created in an injection context (field initializer or constructor)
- no state written inside the effect
- you can explain why the stats from Module 6 are `computed`, not effects

---

## Phase 3: Components

Theme: splitting one big component into a tree — with the signal-based `input()`/`output()`/`model()` APIs instead of `@Input()`/`@Output()` decorators.

### Module 9: Child Components & input()
Concept: `input.required<T>()` — signal inputs replace `@Input()`
Generic Example: `name = input.required<string>()`, read as `name()` in the template
Project Exercise: extract `SessionCard` (`src/app/domains/sessions/components/session-card/`) taking `session = input.required<Session>()` and `selected = input(false)`; the list renders `<app-session-card>` per row
Expected Outcome: identical UI, now component-per-row
Verification:
- `session-card.ts` exists and is imported into `App`'s `imports` array
- no `@Input()` decorators
- card template only reads its own inputs, never parent state

### Module 10: output()
Concept: `output<T>()` replaces `@Output() new EventEmitter()`
Generic Example: `save = output<string>()`, fired with `this.save.emit(value)`
Project Exercise: `SessionCard` emits `select` (on click) and `markDone`; parent owns all state changes — card becomes fully presentational
Expected Outcome: same behavior as Phase 2, but state logic lives only in the parent
Verification:
- card has no reference to the sessions signal
- parent template wires `(select)="…"` and `(markDone)="…"`
- no `EventEmitter` imports

### Module 11: model() & Two-way Binding
Concept: `model()` signals for `[( )]` two-way binding
Generic Example: custom checkbox with `checked = model(false)`
Project Exercise: build `SearchBox` (`shared/ui/search-box/`) with `value = model('')`; parent binds `[(value)]="query"` and derives `filteredSessions = computed(...)` filtering by client name
Expected Outcome: typing filters the session list live
Verification:
- `SearchBox` uses `model()`, not input+output pair
- filtering happens in a `computed`, not in a method call from the template
- clearing the search restores the full list

### Module 12: Content Projection & Shared UI
Concept: `<ng-content>` (including named slots) for wrapper components
Generic Example: a `Card` component projecting header and body slots
Project Exercise: build `PageHeader` (title input + projected actions slot) and `EmptyState` in `shared/ui/`; use both on the sessions view
Expected Outcome: reusable page skeleton — the first pieces of the plan's `shared` layer
Verification:
- `src/app/shared/ui/page-header/` and `shared/ui/empty-state/` exist
- `PageHeader` uses `<ng-content>` for the actions area
- sessions view uses both components

---

## Phase 4: Routing & Services

Theme: the app becomes multi-page and gets real architecture — DI with `inject()`, the plan's `core`/`shared`/`domains` folders, lazy routes, and HTTP against a json-server mock API.

### Module 13: Services & inject()
Concept: `@Injectable({ providedIn: 'root' })` stores; `inject()` replaces constructor injection
Generic Example: `CounterService` with a private writable signal and public `readonly` computed
Project Exercise: create `SessionStore` (`domains/sessions/data-access/session.store.ts`) owning the sessions signal, selection, and all update methods; components `inject(SessionStore)`; move `Session` model to `session.models.ts`
Expected Outcome: no visible change — state now survives outside components
Verification:
- `App` no longer owns the sessions array
- store exposes signals as `readonly`/`asReadonly()`, mutations only via methods
- `inject()` used, no constructor parameter injection

### Module 14: Router & Layout Shell
Concept: `Routes`, `<router-outlet>`, `routerLink`, `routerLinkActive`
Generic Example: two dummy routes toggled by nav links
Project Exercise: build `Shell` in `core/layout/` (sidebar nav + content area per the plan's UI structure); routes: `/dashboard` (stats from Module 6), `/sessions` (the list), redirect `''` → `/dashboard`
Expected Outcome: two-page app with persistent sidebar
Verification:
- `app.routes.ts` has children under a shell route, `''` redirects with `pathMatch: 'full'`
- sidebar highlights the active route via `routerLinkActive`
- browser back/forward works

### Module 15: Route Params
Concept: `/:id` params bound directly to component inputs via `withComponentInputBinding()`
Generic Example: `id = input.required<string>()` populated from the URL
Project Exercise: `/sessions/:id` detail page replaces the inline detail panel; cards navigate with `[routerLink]`
Expected Outcome: each session has a URL; deep-linking works
Verification:
- `withComponentInputBinding()` in `app.config.ts`
- detail page gets `id` as an input, resolves the session via a store `computed`
- pasting a session URL into a fresh tab renders that session

### Module 16: Lazy Loading & Domain Routes
Concept: `loadChildren`/`loadComponent`; each domain owns its routes file
Generic Example: `loadChildren: () => import('./x/x.routes').then(m => m.X_ROUTES)`
Project Exercise: restructure to the plan's folders — `sessions.routes.ts` owning `/sessions` and `/sessions/:id`; add a stub `clients` domain the same way
Expected Outcome: same app; sessions code loads only when visited
Verification:
- `app.routes.ts` contains no direct component imports for domains
- folder layout matches the plan (`domains/sessions/feature-list/`, `feature-detail/`, `data-access/`, `components/`)
- dev tools network tab shows a separate chunk loading on first `/sessions` visit

### Module 17: HttpClient & Mock API
Concept: `provideHttpClient()`, typed `HttpClient` calls, api-vs-store separation
Generic Example: `http.get<Todo[]>('…')` exposed through a service
Project Exercise: add json-server (`npm i -D json-server`, `db.json` with sessions + clients, script `"api": "json-server --watch db.json --port 3000"`); create `session.api.ts` for HTTP; `SessionStore` loads from the API on init and keeps signals as the page-facing state
Expected Outcome: data comes from `http://localhost:3000`; editing `db.json` changes the app
Verification:
- `db.json` and the npm script exist; hardcoded array deleted
- `session.api.ts` contains all HTTP, `session.store.ts` contains all state — pages touch only the store
- create/update actions PATCH/POST to the API and update signals

### Module 18: Interceptors, Loading & Error States
Concept: functional interceptors (`HttpInterceptorFn`); explicit request lifecycle state
Generic Example: interceptor prefixing a base URL and logging failures
Project Exercise: base-URL interceptor (`core/http/`); add `loading`/`error` signals to `SessionStore`; build shared `LoadingState` and `ErrorState` components with a retry button
Expected Outcome: spinner while loading; stopping json-server shows a friendly error with retry
Verification:
- interceptor registered via `provideHttpClient(withInterceptors([...]))`
- api service URLs are relative; base URL lives in one place
- kill the API server → error state renders; restart + retry → list recovers

---

## Phase 5: Forms

Theme: Reactive Forms for the plan's business forms — typed, nonNullable, with `FormArray` and reusable validation UI.

### Module 19: Reactive Form Basics
Concept: `FormBuilder`, `FormGroup`, `Validators`, typed nonNullable forms
Generic Example: login form with required + email validators
Project Exercise: `/clients/new` page with a client form (fullName, email, phone, instagramHandle, notes); on submit, POST via a new `client.api.ts`/`ClientStore` and navigate to `/clients`
Expected Outcome: you can create clients that persist in `db.json`
Verification:
- `fb.nonNullable.group({...})` used; form value is typed (no `any`)
- submit blocked while invalid; required/email errors display
- new client appears in the list and in `db.json`

### Module 20: Edit Mode & Form Reuse
Concept: `patchValue`, one form component serving create and edit
Generic Example: same form initialized empty vs. from an object
Project Exercise: extract `ClientForm` component (`domains/clients/components/client-form/`) used by `/clients/new` and `/clients/:id/edit`; edit pre-fills and PATCHes
Expected Outcome: full create/edit cycle for clients
Verification:
- one form component, two routes
- edit loads existing values before first render settles (handle async load)
- PATCH sends only to the right record

### Module 21: FormArray
Concept: `FormArray` for dynamic collections
Generic Example: a "phone numbers" list with add/remove row buttons
Project Exercise: session create/edit form (`/sessions/new`, `/sessions/:id/edit`) with core fields plus a shot-list `FormArray` — add, remove, reorder-optional
Expected Outcome: sessions with editable shot lists
Verification:
- `shotList` is a `FormArray`, rows added/removed via methods
- saved session round-trips: reopening edit shows the same shot list
- form uses the client list (dropdown of `clientId`) — cross-domain data via `ClientStore`

### Module 22: Custom Validators & Field Wrappers
Concept: custom validator functions; consistent error display via a wrapper component
Generic Example: a `forbiddenName` validator + a `FormField` wrapper showing label/errors
Project Exercise: build `shared/forms/form-field/` wrapper (label, projected control, error messages); add a custom validator (e.g. end time after start time — cross-field, on the group)
Expected Outcome: all forms share one look for labels/errors
Verification:
- client and session forms both use the wrapper
- cross-field validator error appears on the session form
- error messages come from one shared mapping, not copy-pasted strings

### Module 23: Route Guards & Unsaved Changes
Concept: functional guards — `CanDeactivateFn`
Generic Example: guard asking `confirm()` when a flag is set
Project Exercise: unsaved-changes guard on client and session forms using `form.dirty`; wire a shared confirmation (upgraded to a dialog in Phase 6)
Expected Outcome: navigating away from a dirty form asks for confirmation
Verification:
- `canDeactivate` on both edit routes
- clean form navigates silently; dirty form prompts
- guard lives in `core/` or the domain, not inside the page component

---

## Phase 6: UI Library & Scale-Out

Theme: Angular Material for production polish, then proving the patterns by building the remaining domains — ending with a real Node.js backend.

### Module 24: Angular Material Setup
Concept: `ng add @angular/material`, theming, replacing hand-rolled shell
Generic Example: themed `MatToolbar` + `MatButton`
Project Exercise: rebuild the shell with `MatSidenav`/`MatToolbar`/`MatListModule` nav; keep your routes untouched; pick a theme matching a photography brand
Expected Outcome: professional-looking app shell, responsive drawer on small screens
Verification:
- Material theme configured in `styles.scss`
- sidenav collapses to drawer mode on narrow viewports
- existing pages render inside the new shell unchanged

### Module 25: Material Table, Dialog & Snackbar
Concept: `MatTable`, `MatDialog`, `MatSnackBar`; a core notification service
Generic Example: table with sort; confirm dialog returning a boolean
Project Exercise: sessions list becomes a sortable `MatTable`; delete action opens a confirm `MatDialog` (replace Module 23's `confirm()` too); `NotificationService` in `core/services/` wraps snackbars for save/delete feedback
Expected Outcome: table UI, confirmations, and toasts across the app
Verification:
- table sorts by date and status
- no `window.confirm` left in the codebase
- every create/update/delete shows a snackbar via the one service

### Module 26: Repetition — Build Domains Solo
Concept: none new — this proves the patterns are yours
Generic Example: —
Project Exercise: build Leads (list, detail, form, convert-to-client action), then Locations and Packages, each following the domain checklist: models → `x.api.ts` → `x.store.ts` → routes file → list/detail/form pages → Material table
Expected Outcome: 5+ working domains; session form dropdowns use real locations/packages
Verification:
- each domain matches the plan's internal structure
- lead conversion creates a client and links `convertedClientId`
- you built at least one domain without looking back at earlier code

### Module 27: Query Params & Dashboard
Concept: query-parameter state (`router.navigate` with `queryParams`, reading via input binding)
Generic Example: `?status=done` filter surviving reload
Project Exercise: status/type filters on sessions and leads lists stored in query params; dashboard page aggregates across stores (upcoming sessions, open leads, overdue-style task counts as data allows)
Expected Outcome: shareable filtered URLs; a real dashboard landing page
Verification:
- reloading a filtered URL restores the filter state
- filters are signals derived from route inputs, not component-local copies
- dashboard reads from stores only — no direct HTTP

### Module 28: Real Node.js Backend
Concept: swapping the data source without touching UI — the payoff of the api/store split
Generic Example: same REST contract served by Express instead of json-server
Project Exercise: write a small Node/Express (or NestJS) server exposing the same endpoints json-server did, backed by a JSON file or SQLite; point the base-URL interceptor at it; add an environment-based API URL (`core/config/`)
Expected Outcome: the app runs against your own server; json-server retired
Verification:
- zero changes needed in components or stores — only config/api layer
- all CRUD flows work against the new server
- API base URL comes from environment config, not hardcoded

---

## After the curriculum

The plan's remaining items become independent projects, in rough order of value: Invoices/Deliveries/Tasks/Templates domains (more Module 26-style repetition), auth guard + login (core/auth), unsaved-data-safe global error interceptor, and the extensibility list (calendar sync, PWA, gallery integration).

## Module checklist template (for authoring your own)

```
### Module N: Title
Concept: one concept
Generic Example: minimal isolated example
Project Exercise: what to build in Shotplan
Expected Outcome: visible app change
Verification:
- files that should exist
- API that must be used
- behavior to check by hand
```
