import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRoutine, Routine } from '../routine.model';
import { RoutineService } from '../service/routine.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-routine-update',
  templateUrl: './routine-update.component.html',
})
export class RoutineUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    dateStarted: [],
    dateEnded: [],
    goalDate: [],
    startingBodyWeight: [],
    endingBodyWeight: [],
    users: [],
  });

  constructor(
    protected routineService: RoutineService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ routine }) => {
      this.updateForm(routine);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const routine = this.createFromForm();
    if (routine.id !== undefined) {
      this.subscribeToSaveResponse(this.routineService.update(routine));
    } else {
      this.subscribeToSaveResponse(this.routineService.create(routine));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoutine>>): void {
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

  protected updateForm(routine: IRoutine): void {
    this.editForm.patchValue({
      id: routine.id,
      name: routine.name,
      dateStarted: routine.dateStarted,
      dateEnded: routine.dateEnded,
      goalDate: routine.goalDate,
      startingBodyWeight: routine.startingBodyWeight,
      endingBodyWeight: routine.endingBodyWeight,
      users: routine.users,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, ...(routine.users ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, ...(this.editForm.get('users')!.value ?? []))))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IRoutine {
    return {
      ...new Routine(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      dateStarted: this.editForm.get(['dateStarted'])!.value,
      dateEnded: this.editForm.get(['dateEnded'])!.value,
      goalDate: this.editForm.get(['goalDate'])!.value,
      startingBodyWeight: this.editForm.get(['startingBodyWeight'])!.value,
      endingBodyWeight: this.editForm.get(['endingBodyWeight'])!.value,
      users: this.editForm.get(['users'])!.value,
    };
  }
}
