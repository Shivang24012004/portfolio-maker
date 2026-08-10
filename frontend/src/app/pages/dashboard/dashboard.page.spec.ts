import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardPage } from './dashboard.page';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: LayoutApiService,
          useValue: { list: () => of([]), create: () => of(null), delete: () => of(undefined) },
        },
        {
          provide: LayoutDataApiService,
          useValue: {
            create: () => of(null),
            getByLayoutId: () => of(null),
            delete: () => of(undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
