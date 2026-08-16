import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of, switchMap, catchError } from 'rxjs';
import { Layout, ContentMap } from '../../core/models/layouts.models';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';
import { LayoutRenderer } from '../../shared/layout-renderer/layout-renderer';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [LayoutRenderer, RouterLink],
  templateUrl: './preview.page.html',
  styleUrl: './preview.page.css',
})
export class PreviewPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly layoutsApi = inject(LayoutApiService);
  private readonly layoutDataApi = inject(LayoutDataApiService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  layout = signal<Layout | null>(null);
  content = signal<ContentMap>({});
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const layoutId = params.get('layoutId');
          if (!layoutId) {
            this.layout.set(null);
            this.content.set({});
            this.error.set('Missing layout id');
            this.loading.set(false);
            this.title.setTitle('Preview · Portfolio Maker');
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);

          return forkJoin({
            layout: this.layoutsApi.getById(layoutId),
            data: this.layoutDataApi.getByLayoutId(layoutId),
          }).pipe(
            catchError((err) => {
              const detail = err?.error?.detail;
              this.error.set(typeof detail === 'string' ? detail : 'Failed to load preview');
              this.layout.set(null);
              this.content.set({});
              this.loading.set(false);
              this.title.setTitle('Preview · Portfolio Maker');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        this.layout.set(result.layout);
        this.content.set(result.data.content ?? {});
        this.loading.set(false);
        this.title.setTitle(`${result.layout.name} · Preview`);
      });
  }
}
