import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExcercise, Excercise } from '../excercise.model';
import { ExcerciseService } from '../service/excercise.service';
import { IRoutine } from 'app/entities/routine/routine.model';
import { RoutineService } from 'app/entities/routine/service/routine.service';

@Component({
  selector: 'jhi-excercise-update',
  templateUrl: './excercise-update.component.html',
})
export class ExcerciseUpdateComponent implements OnInit {
  isSaving = false;

  routinesSharedCollection: IRoutine[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    currentVolume: [],
    startingVolume: [],
    goalVolume: [],
    routine: [],
  });

  constructor(
    protected excerciseService: ExcerciseService,
    protected routineService: RoutineService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ excercise }) => {
      this.updateForm(excercise);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const excercise = this.createFromForm();
    if (excercise.id !== undefined) {
      this.subscribeToSaveResponse(this.excerciseService.update(excercise));
    } else {
      this.subscribeToSaveResponse(this.excerciseService.create(excercise));
    }
  }

  trackRoutineById(index: number, item: IRoutine): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExcercise>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(excercise: IExcercise): void {
    this.editForm.patchValue({
      id: excercise.id,
      type: excercise.type,
      currentVolume: excercise.currentVolume,
      startingVolume: excercise.startingVolume,
      goalVolume: excercise.goalVolume,
      routine: excercise.routine,
    });

    this.routinesSharedCollection = this.routineService.addRoutineToCollectionIfMissing(this.routinesSharedCollection, excercise.routine);
  }

  protected loadRelationshipsOptions(): void {
    this.routineService
      .query()
      .pipe(map((res: HttpResponse<IRoutine[]>) => res.body ?? []))
      .pipe(
        map((routines: IRoutine[]) => this.routineService.addRoutineToCollectionIfMissing(routines, this.editForm.get('routine')!.value))
      )
      .subscribe((routines: IRoutine[]) => (this.routinesSharedCollection = routines));
  }

  protected createFromForm(): IExcercise {
    return {
      ...new Excercise(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      currentVolume: this.editForm.get(['currentVolume'])!.value,
      startingVolume: this.editForm.get(['startingVolume'])!.value,
      goalVolume: this.editForm.get(['goalVolume'])!.value,
      routine: this.editForm.get(['routine'])!.value,
    };
  }
}
