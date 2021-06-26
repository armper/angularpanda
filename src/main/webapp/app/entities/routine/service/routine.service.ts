import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoutine, getRoutineIdentifier } from '../routine.model';

export type EntityResponseType = HttpResponse<IRoutine>;
export type EntityArrayResponseType = HttpResponse<IRoutine[]>;

@Injectable({ providedIn: 'root' })
export class RoutineService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/routines');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(routine: IRoutine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(routine);
    return this.http
      .post<IRoutine>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(routine: IRoutine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(routine);
    return this.http
      .put<IRoutine>(`${this.resourceUrl}/${getRoutineIdentifier(routine) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(routine: IRoutine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(routine);
    return this.http
      .patch<IRoutine>(`${this.resourceUrl}/${getRoutineIdentifier(routine) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRoutine>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRoutine[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRoutineToCollectionIfMissing(routineCollection: IRoutine[], ...routinesToCheck: (IRoutine | null | undefined)[]): IRoutine[] {
    const routines: IRoutine[] = routinesToCheck.filter(isPresent);
    if (routines.length > 0) {
      const routineCollectionIdentifiers = routineCollection.map(routineItem => getRoutineIdentifier(routineItem)!);
      const routinesToAdd = routines.filter(routineItem => {
        const routineIdentifier = getRoutineIdentifier(routineItem);
        if (routineIdentifier == null || routineCollectionIdentifiers.includes(routineIdentifier)) {
          return false;
        }
        routineCollectionIdentifiers.push(routineIdentifier);
        return true;
      });
      return [...routinesToAdd, ...routineCollection];
    }
    return routineCollection;
  }

  protected convertDateFromClient(routine: IRoutine): IRoutine {
    return Object.assign({}, routine, {
      dateStarted: routine.dateStarted?.isValid() ? routine.dateStarted.format(DATE_FORMAT) : undefined,
      dateEnded: routine.dateEnded?.isValid() ? routine.dateEnded.format(DATE_FORMAT) : undefined,
      goalDate: routine.goalDate?.isValid() ? routine.goalDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateStarted = res.body.dateStarted ? dayjs(res.body.dateStarted) : undefined;
      res.body.dateEnded = res.body.dateEnded ? dayjs(res.body.dateEnded) : undefined;
      res.body.goalDate = res.body.goalDate ? dayjs(res.body.goalDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((routine: IRoutine) => {
        routine.dateStarted = routine.dateStarted ? dayjs(routine.dateStarted) : undefined;
        routine.dateEnded = routine.dateEnded ? dayjs(routine.dateEnded) : undefined;
        routine.goalDate = routine.goalDate ? dayjs(routine.goalDate) : undefined;
      });
    }
    return res;
  }
}
