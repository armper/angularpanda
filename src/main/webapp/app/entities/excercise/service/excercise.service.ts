import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExcercise, getExcerciseIdentifier } from '../excercise.model';

export type EntityResponseType = HttpResponse<IExcercise>;
export type EntityArrayResponseType = HttpResponse<IExcercise[]>;

@Injectable({ providedIn: 'root' })
export class ExcerciseService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/excercises');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(excercise: IExcercise): Observable<EntityResponseType> {
    return this.http.post<IExcercise>(this.resourceUrl, excercise, { observe: 'response' });
  }

  update(excercise: IExcercise): Observable<EntityResponseType> {
    return this.http.put<IExcercise>(`${this.resourceUrl}/${getExcerciseIdentifier(excercise) as number}`, excercise, {
      observe: 'response',
    });
  }

  partialUpdate(excercise: IExcercise): Observable<EntityResponseType> {
    return this.http.patch<IExcercise>(`${this.resourceUrl}/${getExcerciseIdentifier(excercise) as number}`, excercise, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExcercise>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExcercise[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExcerciseToCollectionIfMissing(
    excerciseCollection: IExcercise[],
    ...excercisesToCheck: (IExcercise | null | undefined)[]
  ): IExcercise[] {
    const excercises: IExcercise[] = excercisesToCheck.filter(isPresent);
    if (excercises.length > 0) {
      const excerciseCollectionIdentifiers = excerciseCollection.map(excerciseItem => getExcerciseIdentifier(excerciseItem)!);
      const excercisesToAdd = excercises.filter(excerciseItem => {
        const excerciseIdentifier = getExcerciseIdentifier(excerciseItem);
        if (excerciseIdentifier == null || excerciseCollectionIdentifiers.includes(excerciseIdentifier)) {
          return false;
        }
        excerciseCollectionIdentifiers.push(excerciseIdentifier);
        return true;
      });
      return [...excercisesToAdd, ...excerciseCollection];
    }
    return excerciseCollection;
  }
}
