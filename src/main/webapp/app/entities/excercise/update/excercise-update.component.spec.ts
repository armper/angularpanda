jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExcerciseService } from '../service/excercise.service';
import { IExcercise, Excercise } from '../excercise.model';
import { IRoutine } from 'app/entities/routine/routine.model';
import { RoutineService } from 'app/entities/routine/service/routine.service';

import { ExcerciseUpdateComponent } from './excercise-update.component';

describe('Component Tests', () => {
  describe('Excercise Management Update Component', () => {
    let comp: ExcerciseUpdateComponent;
    let fixture: ComponentFixture<ExcerciseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let excerciseService: ExcerciseService;
    let routineService: RoutineService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExcerciseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExcerciseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExcerciseUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      excerciseService = TestBed.inject(ExcerciseService);
      routineService = TestBed.inject(RoutineService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Routine query and add missing value', () => {
        const excercise: IExcercise = { id: 456 };
        const routine: IRoutine = { id: 11116 };
        excercise.routine = routine;

        const routineCollection: IRoutine[] = [{ id: 66601 }];
        spyOn(routineService, 'query').and.returnValue(of(new HttpResponse({ body: routineCollection })));
        const additionalRoutines = [routine];
        const expectedCollection: IRoutine[] = [...additionalRoutines, ...routineCollection];
        spyOn(routineService, 'addRoutineToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ excercise });
        comp.ngOnInit();

        expect(routineService.query).toHaveBeenCalled();
        expect(routineService.addRoutineToCollectionIfMissing).toHaveBeenCalledWith(routineCollection, ...additionalRoutines);
        expect(comp.routinesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const excercise: IExcercise = { id: 456 };
        const routine: IRoutine = { id: 52327 };
        excercise.routine = routine;

        activatedRoute.data = of({ excercise });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(excercise));
        expect(comp.routinesSharedCollection).toContain(routine);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const excercise = { id: 123 };
        spyOn(excerciseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ excercise });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: excercise }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(excerciseService.update).toHaveBeenCalledWith(excercise);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const excercise = new Excercise();
        spyOn(excerciseService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ excercise });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: excercise }));
        saveSubject.complete();

        // THEN
        expect(excerciseService.create).toHaveBeenCalledWith(excercise);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const excercise = { id: 123 };
        spyOn(excerciseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ excercise });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(excerciseService.update).toHaveBeenCalledWith(excercise);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRoutineById', () => {
        it('Should return tracked Routine primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRoutineById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
