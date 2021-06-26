import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExcercise, Excercise } from '../excercise.model';
import { ExcerciseService } from '../service/excercise.service';

@Injectable({ providedIn: 'root' })
export class ExcerciseRoutingResolveService implements Resolve<IExcercise> {
  constructor(protected service: ExcerciseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExcercise> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((excercise: HttpResponse<Excercise>) => {
          if (excercise.body) {
            return of(excercise.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Excercise());
  }
}
