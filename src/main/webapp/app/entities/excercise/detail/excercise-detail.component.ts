import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExcercise } from '../excercise.model';

@Component({
  selector: 'jhi-excercise-detail',
  templateUrl: './excercise-detail.component.html',
})
export class ExcerciseDetailComponent implements OnInit {
  excercise: IExcercise | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ excercise }) => {
      this.excercise = excercise;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
