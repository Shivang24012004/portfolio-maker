import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { PreviewPage } from './preview.page';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';
import { SAMPLE_LAYOUT, SAMPLE_LAYOUT_DATA } from '../../core/data/sample-layout';

describe('PreviewPage', () => {
  let component: PreviewPage;
  let fixture: ComponentFixture<PreviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ layoutId: SAMPLE_LAYOUT.id })),
          },
        },
        {
          provide: LayoutApiService,
          useValue: { getById: () => of(structuredClone(SAMPLE_LAYOUT)) },
        },
        {
          provide: LayoutDataApiService,
          useValue: { getByLayoutId: () => of(structuredClone(SAMPLE_LAYOUT_DATA)) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load layout into preview', async () => {
    await fixture.whenStable();
    expect(component.layout()?.id).toBe(SAMPLE_LAYOUT.id);
    expect(component.loading()).toBe(false);
  });
});
