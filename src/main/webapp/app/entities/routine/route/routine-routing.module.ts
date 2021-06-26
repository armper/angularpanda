import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoutineComponent } from '../list/routine.component';
import { RoutineDetailComponent } from '../detail/routine-detail.component';
import { RoutineUpdateComponent } from '../update/routine-update.component';
import { RoutineRoutingResolveService } from './routine-routing-resolve.service';

const routineRoute: Routes = [
  {
    path: '',
    component: RoutineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoutineDetailComponent,
    resolve: {
      routine: RoutineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoutineUpdateComponent,
    resolve: {
      routine: RoutineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoutineUpdateComponent,
    resolve: {
      routine: RoutineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routineRoute)],
  exports: [RouterModule],
})
export class RoutineRoutingModule {}
