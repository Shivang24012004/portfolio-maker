import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditorPage } from './editor.page';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';
import { SAMPLE_LAYOUT, SAMPLE_LAYOUT_DATA } from '../../core/data/sample-layout';

describe('EditorPage', () => {
  let component: EditorPage;
  let fixture: ComponentFixture<EditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => SAMPLE_LAYOUT.id } } },
        },
        {
          provide: LayoutApiService,
          useValue: {
            getById: () => of(structuredClone(SAMPLE_LAYOUT)),
            update: () => of(structuredClone(SAMPLE_LAYOUT)),
          },
        },
        {
          provide: LayoutDataApiService,
          useValue: {
            getByLayoutId: () => of(structuredClone(SAMPLE_LAYOUT_DATA)),
            update: () => of(structuredClone(SAMPLE_LAYOUT_DATA)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
