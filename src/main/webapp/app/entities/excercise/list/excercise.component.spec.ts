import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExcerciseService } from '../service/excercise.service';

import { ExcerciseComponent } from './excercise.component';

describe('Component Tests', () => {
  describe('Excercise Management Component', () => {
    let comp: ExcerciseComponent;
    let fixture: ComponentFixture<ExcerciseComponent>;
    let service: ExcerciseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExcerciseComponent],
      })
        .overrideTemplate(ExcerciseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExcerciseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ExcerciseService);

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
      expect(comp.excercises?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
