jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CycleService } from '../service/cycle.service';
import { ICycle, Cycle } from '../cycle.model';
import { IExcercise } from 'app/entities/excercise/excercise.model';
import { ExcerciseService } from 'app/entities/excercise/service/excercise.service';

import { CycleUpdateComponent } from './cycle-update.component';

describe('Component Tests', () => {
  describe('Cycle Management Update Component', () => {
    let comp: CycleUpdateComponent;
    let fixture: ComponentFixture<CycleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cycleService: CycleService;
    let excerciseService: ExcerciseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CycleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CycleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CycleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cycleService = TestBed.inject(CycleService);
      excerciseService = TestBed.inject(ExcerciseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Excercise query and add missing value', () => {
        const cycle: ICycle = { id: 456 };
        const excercise: IExcercise = { id: 72846 };
        cycle.excercise = excercise;

        const excerciseCollection: IExcercise[] = [{ id: 15475 }];
        spyOn(excerciseService, 'query').and.returnValue(of(new HttpResponse({ body: excerciseCollection })));
        const additionalExcercises = [excercise];
        const expectedCollection: IExcercise[] = [...additionalExcercises, ...excerciseCollection];
        spyOn(excerciseService, 'addExcerciseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cycle });
        comp.ngOnInit();

        expect(excerciseService.query).toHaveBeenCalled();
        expect(excerciseService.addExcerciseToCollectionIfMissing).toHaveBeenCalledWith(excerciseCollection, ...additionalExcercises);
        expect(comp.excercisesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cycle: ICycle = { id: 456 };
        const excercise: IExcercise = { id: 40191 };
        cycle.excercise = excercise;

        activatedRoute.data = of({ cycle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cycle));
        expect(comp.excercisesSharedCollection).toContain(excercise);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cycle = { id: 123 };
        spyOn(cycleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cycle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cycle }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cycleService.update).toHaveBeenCalledWith(cycle);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cycle = new Cycle();
        spyOn(cycleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cycle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cycle }));
        saveSubject.complete();

        // THEN
        expect(cycleService.create).toHaveBeenCalledWith(cycle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cycle = { id: 123 };
        spyOn(cycleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cycle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cycleService.update).toHaveBeenCalledWith(cycle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackExcerciseById', () => {
        it('Should return tracked Excercise primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackExcerciseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
