import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExcerciseDetailComponent } from './excercise-detail.component';

describe('Component Tests', () => {
  describe('Excercise Management Detail Component', () => {
    let comp: ExcerciseDetailComponent;
    let fixture: ComponentFixture<ExcerciseDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ExcerciseDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ excercise: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ExcerciseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ExcerciseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load excercise on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.excercise).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
