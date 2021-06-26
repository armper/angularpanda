import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoutine } from '../routine.model';
import { RoutineService } from '../service/routine.service';
import { RoutineDeleteDialogComponent } from '../delete/routine-delete-dialog.component';

@Component({
  selector: 'jhi-routine',
  templateUrl: './routine.component.html',
})
export class RoutineComponent implements OnInit {
  routines?: IRoutine[];
  isLoading = false;

  constructor(protected routineService: RoutineService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.routineService.query().subscribe(
      (res: HttpResponse<IRoutine[]>) => {
        this.isLoading = false;
        this.routines = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRoutine): number {
    return item.id!;
  }

  delete(routine: IRoutine): void {
    const modalRef = this.modalService.open(RoutineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.routine = routine;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
