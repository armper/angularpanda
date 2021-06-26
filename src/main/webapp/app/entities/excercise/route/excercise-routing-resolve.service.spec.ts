jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExcercise, Excercise } from '../excercise.model';
import { ExcerciseService } from '../service/excercise.service';

import { ExcerciseRoutingResolveService } from './excercise-routing-resolve.service';

describe('Service Tests', () => {
  describe('Excercise routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExcerciseRoutingResolveService;
    let service: ExcerciseService;
    let resultExcercise: IExcercise | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExcerciseRoutingResolveService);
      service = TestBed.inject(ExcerciseService);
      resultExcercise = undefined;
    });

    describe('resolve', () => {
      it('should return IExcercise returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExcercise = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExcercise).toEqual({ id: 123 });
      });

      it('should return new IExcercise if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExcercise = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExcercise).toEqual(new Excercise());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExcercise = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExcercise).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
