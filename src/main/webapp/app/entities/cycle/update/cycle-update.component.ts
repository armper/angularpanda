import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICycle, Cycle } from '../cycle.model';
import { CycleService } from '../service/cycle.service';
import { IExcercise } from 'app/entities/excercise/excercise.model';
import { ExcerciseService } from 'app/entities/excercise/service/excercise.service';

@Component({
  selector: 'jhi-cycle-update',
  templateUrl: './cycle-update.component.html',
})
export class CycleUpdateComponent implements OnInit {
  isSaving = false;

  excercisesSharedCollection: IExcercise[] = [];

  editForm = this.fb.group({
    id: [],
    reps: [],
    volume: [],
    excercise: [],
  });

  constructor(
    protected cycleService: CycleService,
    protected excerciseService: ExcerciseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cycle }) => {
      this.updateForm(cycle);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cycle = this.createFromForm();
    if (cycle.id !== undefined) {
      this.subscribeToSaveResponse(this.cycleService.update(cycle));
    } else {
      this.subscribeToSaveResponse(this.cycleService.create(cycle));
    }
  }

  trackExcerciseById(index: number, item: IExcercise): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICycle>>): void {
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

  protected updateForm(cycle: ICycle): void {
    this.editForm.patchValue({
      id: cycle.id,
      reps: cycle.reps,
      volume: cycle.volume,
      excercise: cycle.excercise,
    });

    this.excercisesSharedCollection = this.excerciseService.addExcerciseToCollectionIfMissing(
      this.excercisesSharedCollection,
      cycle.excercise
    );
  }

  protected loadRelationshipsOptions(): void {
    this.excerciseService
      .query()
      .pipe(map((res: HttpResponse<IExcercise[]>) => res.body ?? []))
      .pipe(
        map((excercises: IExcercise[]) =>
          this.excerciseService.addExcerciseToCollectionIfMissing(excercises, this.editForm.get('excercise')!.value)
        )
      )
      .subscribe((excercises: IExcercise[]) => (this.excercisesSharedCollection = excercises));
  }

  protected createFromForm(): ICycle {
    return {
      ...new Cycle(),
      id: this.editForm.get(['id'])!.value,
      reps: this.editForm.get(['reps'])!.value,
      volume: this.editForm.get(['volume'])!.value,
      excercise: this.editForm.get(['excercise'])!.value,
    };
  }
}
