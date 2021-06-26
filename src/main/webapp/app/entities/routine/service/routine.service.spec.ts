import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRoutine, Routine } from '../routine.model';

import { RoutineService } from './routine.service';

describe('Service Tests', () => {
  describe('Routine Service', () => {
    let service: RoutineService;
    let httpMock: HttpTestingController;
    let elemDefault: IRoutine;
    let expectedResult: IRoutine | IRoutine[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RoutineService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        dateStarted: currentDate,
        dateEnded: currentDate,
        goalDate: currentDate,
        startingBodyWeight: 0,
        endingBodyWeight: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateStarted: currentDate.format(DATE_FORMAT),
            dateEnded: currentDate.format(DATE_FORMAT),
            goalDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Routine', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateStarted: currentDate.format(DATE_FORMAT),
            dateEnded: currentDate.format(DATE_FORMAT),
            goalDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStarted: currentDate,
            dateEnded: currentDate,
            goalDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Routine()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Routine', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            dateStarted: currentDate.format(DATE_FORMAT),
            dateEnded: currentDate.format(DATE_FORMAT),
            goalDate: currentDate.format(DATE_FORMAT),
            startingBodyWeight: 1,
            endingBodyWeight: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStarted: currentDate,
            dateEnded: currentDate,
            goalDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Routine', () => {
        const patchObject = Object.assign(
          {
            dateStarted: currentDate.format(DATE_FORMAT),
            dateEnded: currentDate.format(DATE_FORMAT),
            goalDate: currentDate.format(DATE_FORMAT),
            startingBodyWeight: 1,
          },
          new Routine()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateStarted: currentDate,
            dateEnded: currentDate,
            goalDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Routine', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            dateStarted: currentDate.format(DATE_FORMAT),
            dateEnded: currentDate.format(DATE_FORMAT),
            goalDate: currentDate.format(DATE_FORMAT),
            startingBodyWeight: 1,
            endingBodyWeight: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStarted: currentDate,
            dateEnded: currentDate,
            goalDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Routine', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRoutineToCollectionIfMissing', () => {
        it('should add a Routine to an empty array', () => {
          const routine: IRoutine = { id: 123 };
          expectedResult = service.addRoutineToCollectionIfMissing([], routine);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(routine);
        });

        it('should not add a Routine to an array that contains it', () => {
          const routine: IRoutine = { id: 123 };
          const routineCollection: IRoutine[] = [
            {
              ...routine,
            },
            { id: 456 },
          ];
          expectedResult = service.addRoutineToCollectionIfMissing(routineCollection, routine);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Routine to an array that doesn't contain it", () => {
          const routine: IRoutine = { id: 123 };
          const routineCollection: IRoutine[] = [{ id: 456 }];
          expectedResult = service.addRoutineToCollectionIfMissing(routineCollection, routine);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(routine);
        });

        it('should add only unique Routine to an array', () => {
          const routineArray: IRoutine[] = [{ id: 123 }, { id: 456 }, { id: 29589 }];
          const routineCollection: IRoutine[] = [{ id: 123 }];
          expectedResult = service.addRoutineToCollectionIfMissing(routineCollection, ...routineArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const routine: IRoutine = { id: 123 };
          const routine2: IRoutine = { id: 456 };
          expectedResult = service.addRoutineToCollectionIfMissing([], routine, routine2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(routine);
          expect(expectedResult).toContain(routine2);
        });

        it('should accept null and undefined values', () => {
          const routine: IRoutine = { id: 123 };
          expectedResult = service.addRoutineToCollectionIfMissing([], null, routine, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(routine);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
