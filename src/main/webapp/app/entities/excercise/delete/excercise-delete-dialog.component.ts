import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExcercise } from '../excercise.model';
import { ExcerciseService } from '../service/excercise.service';

@Component({
  templateUrl: './excercise-delete-dialog.component.html',
})
export class ExcerciseDeleteDialogComponent {
  excercise?: IExcercise;

  constructor(protected excerciseService: ExcerciseService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.excerciseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
