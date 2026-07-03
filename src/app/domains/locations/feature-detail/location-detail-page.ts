import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LocationStore } from '../data-access/location.store';

@Component({
  selector: 'app-location-detail-page',
  imports: [EmptyState, ErrorState, LoadingState, PageHeader, RouterLink],
  templateUrl: './location-detail-page.html',
  styleUrl: './location-detail-page.scss',
})
export class LocationDetailPage {
  readonly id = input.required<string>();
  protected readonly locationStore = inject(LocationStore);
  protected readonly location = computed(() => this.locationStore.locationById(this.id()));

  private readonly loadLocationEffect = effect(() => {
    this.locationStore.loadLocation(this.id()).subscribe();
  });
}
