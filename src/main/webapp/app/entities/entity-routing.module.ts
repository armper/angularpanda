import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'routine',
        data: { pageTitle: 'Routines' },
        loadChildren: () => import('./routine/routine.module').then(m => m.RoutineModule),
      },
      {
        path: 'excercise',
        data: { pageTitle: 'Excercises' },
        loadChildren: () => import('./excercise/excercise.module').then(m => m.ExcerciseModule),
      },
      {
        path: 'cycle',
        data: { pageTitle: 'Cycles' },
        loadChildren: () => import('./cycle/cycle.module').then(m => m.CycleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
