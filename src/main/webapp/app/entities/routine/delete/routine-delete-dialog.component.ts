import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoutine } from '../routine.model';
import { RoutineService } from '../service/routine.service';

@Component({
  templateUrl: './routine-delete-dialog.component.html',
})
export class RoutineDeleteDialogComponent {
  routine?: IRoutine;

  constructor(protected routineService: RoutineService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.routineService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
