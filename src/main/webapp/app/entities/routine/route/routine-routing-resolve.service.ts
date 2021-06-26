import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRoutine, Routine } from '../routine.model';
import { RoutineService } from '../service/routine.service';

@Injectable({ providedIn: 'root' })
export class RoutineRoutingResolveService implements Resolve<IRoutine> {
  constructor(protected service: RoutineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoutine> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((routine: HttpResponse<Routine>) => {
          if (routine.body) {
            return of(routine.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Routine());
  }
}
