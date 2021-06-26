import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExcerciseComponent } from '../list/excercise.component';
import { ExcerciseDetailComponent } from '../detail/excercise-detail.component';
import { ExcerciseUpdateComponent } from '../update/excercise-update.component';
import { ExcerciseRoutingResolveService } from './excercise-routing-resolve.service';

const excerciseRoute: Routes = [
  {
    path: '',
    component: ExcerciseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExcerciseDetailComponent,
    resolve: {
      excercise: ExcerciseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExcerciseUpdateComponent,
    resolve: {
      excercise: ExcerciseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExcerciseUpdateComponent,
    resolve: {
      excercise: ExcerciseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(excerciseRoute)],
  exports: [RouterModule],
})
export class ExcerciseRoutingModule {}
