import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RoutineComponent } from './list/routine.component';
import { RoutineDetailComponent } from './detail/routine-detail.component';
import { RoutineUpdateComponent } from './update/routine-update.component';
import { RoutineDeleteDialogComponent } from './delete/routine-delete-dialog.component';
import { RoutineRoutingModule } from './route/routine-routing.module';

@NgModule({
  imports: [SharedModule, RoutineRoutingModule],
  declarations: [RoutineComponent, RoutineDetailComponent, RoutineUpdateComponent, RoutineDeleteDialogComponent],
  entryComponents: [RoutineDeleteDialogComponent],
})
export class RoutineModule {}
