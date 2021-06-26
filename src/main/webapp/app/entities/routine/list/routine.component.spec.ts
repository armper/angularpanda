import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RoutineService } from '../service/routine.service';

import { RoutineComponent } from './routine.component';

describe('Component Tests', () => {
  describe('Routine Management Component', () => {
    let comp: RoutineComponent;
    let fixture: ComponentFixture<RoutineComponent>;
    let service: RoutineService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoutineComponent],
      })
        .overrideTemplate(RoutineComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoutineComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RoutineService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.routines?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
