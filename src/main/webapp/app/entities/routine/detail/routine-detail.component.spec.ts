import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoutineDetailComponent } from './routine-detail.component';

describe('Component Tests', () => {
  describe('Routine Management Detail Component', () => {
    let comp: RoutineDetailComponent;
    let fixture: ComponentFixture<RoutineDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RoutineDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ routine: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RoutineDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RoutineDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load routine on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.routine).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
