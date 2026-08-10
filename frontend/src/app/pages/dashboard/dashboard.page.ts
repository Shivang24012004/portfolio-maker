import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Layout } from '../../core/models/layouts.models';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';
import { createPortfolioSeed } from '../../core/utils/clone-layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private readonly layoutsApi = inject(LayoutApiService);
  private readonly layoutDataApi = inject(LayoutDataApiService);
  private readonly router = inject(Router);

  layouts = signal<Layout[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  creating = signal(false);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.layoutsApi.list().subscribe({
      next: (items) => {
        this.layouts.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.errorDetail(err, 'Failed to load portfolios'));
        this.loading.set(false);
      },
    });
  }

  createPortfolio(): void {
    if (this.creating()) return;
    this.creating.set(true);
    this.error.set(null);
    const { layout, layoutData } = createPortfolioSeed();

    forkJoin({
      layout: this.layoutsApi.create(layout),
      data: this.layoutDataApi.create(layoutData),
    }).subscribe({
      next: ({ layout: created }) => {
        this.creating.set(false);
        void this.router.navigate(['/editor', created.id]);
      },
      error: (err) => {
        this.creating.set(false);
        this.error.set(this.errorDetail(err, 'Failed to create portfolio'));
      },
    });
  }

  deletePortfolio(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Delete this portfolio?')) return;

    this.layoutDataApi
      .getByLayoutId(id)
      .pipe(
        catchError(() => of(null)),
        switchMap((data) =>
          forkJoin({
            layout: this.layoutsApi.delete(id),
            data: data ? this.layoutDataApi.delete(data.id) : of(undefined),
          }),
        ),
      )
      .subscribe({
        next: () => this.reload(),
        error: (err) => {
          this.error.set(this.errorDetail(err, 'Failed to delete'));
        },
      });
  }

  private errorDetail(err: unknown, fallback: string): string {
    const detail = (err as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' ? detail : fallback;
  }
}
