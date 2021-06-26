import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExcercise } from '../excercise.model';
import { ExcerciseService } from '../service/excercise.service';
import { ExcerciseDeleteDialogComponent } from '../delete/excercise-delete-dialog.component';

@Component({
  selector: 'jhi-excercise',
  templateUrl: './excercise.component.html',
})
export class ExcerciseComponent implements OnInit {
  excercises?: IExcercise[];
  isLoading = false;

  constructor(protected excerciseService: ExcerciseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.excerciseService.query().subscribe(
      (res: HttpResponse<IExcercise[]>) => {
        this.isLoading = false;
        this.excercises = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IExcercise): number {
    return item.id!;
  }

  delete(excercise: IExcercise): void {
    const modalRef = this.modalService.open(ExcerciseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.excercise = excercise;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
