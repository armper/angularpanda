import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExcerciseType } from 'app/entities/enumerations/excercise-type.model';
import { IExcercise, Excercise } from '../excercise.model';

import { ExcerciseService } from './excercise.service';

describe('Service Tests', () => {
  describe('Excercise Service', () => {
    let service: ExcerciseService;
    let httpMock: HttpTestingController;
    let elemDefault: IExcercise;
    let expectedResult: IExcercise | IExcercise[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ExcerciseService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        type: ExcerciseType.BARBELL,
        currentVolume: 0,
        startingVolume: 0,
        goalVolume: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Excercise', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Excercise()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Excercise', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            currentVolume: 1,
            startingVolume: 1,
            goalVolume: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Excercise', () => {
        const patchObject = Object.assign({}, new Excercise());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Excercise', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            currentVolume: 1,
            startingVolume: 1,
            goalVolume: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Excercise', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addExcerciseToCollectionIfMissing', () => {
        it('should add a Excercise to an empty array', () => {
          const excercise: IExcercise = { id: 123 };
          expectedResult = service.addExcerciseToCollectionIfMissing([], excercise);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(excercise);
        });

        it('should not add a Excercise to an array that contains it', () => {
          const excercise: IExcercise = { id: 123 };
          const excerciseCollection: IExcercise[] = [
            {
              ...excercise,
            },
            { id: 456 },
          ];
          expectedResult = service.addExcerciseToCollectionIfMissing(excerciseCollection, excercise);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Excercise to an array that doesn't contain it", () => {
          const excercise: IExcercise = { id: 123 };
          const excerciseCollection: IExcercise[] = [{ id: 456 }];
          expectedResult = service.addExcerciseToCollectionIfMissing(excerciseCollection, excercise);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(excercise);
        });

        it('should add only unique Excercise to an array', () => {
          const excerciseArray: IExcercise[] = [{ id: 123 }, { id: 456 }, { id: 89563 }];
          const excerciseCollection: IExcercise[] = [{ id: 123 }];
          expectedResult = service.addExcerciseToCollectionIfMissing(excerciseCollection, ...excerciseArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const excercise: IExcercise = { id: 123 };
          const excercise2: IExcercise = { id: 456 };
          expectedResult = service.addExcerciseToCollectionIfMissing([], excercise, excercise2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(excercise);
          expect(expectedResult).toContain(excercise2);
        });

        it('should accept null and undefined values', () => {
          const excercise: IExcercise = { id: 123 };
          expectedResult = service.addExcerciseToCollectionIfMissing([], null, excercise, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(excercise);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
