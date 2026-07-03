import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { PackageStore } from '../data-access/package.store';

@Component({
  selector: 'app-package-detail-page',
  imports: [CurrencyPipe, EmptyState, ErrorState, LoadingState, PageHeader, RouterLink],
  templateUrl: './package-detail-page.html',
  styleUrl: './package-detail-page.scss',
})
export class PackageDetailPage {
  readonly id = input.required<string>();
  protected readonly packageStore = inject(PackageStore);
  protected readonly photoPackage = computed(() => this.packageStore.packageById(this.id()));

  private readonly loadPackageEffect = effect(() => {
    this.packageStore.loadPackage(this.id()).subscribe();
  });
}
