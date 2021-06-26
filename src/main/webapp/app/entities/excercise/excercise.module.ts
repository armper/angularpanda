import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ExcerciseComponent } from './list/excercise.component';
import { ExcerciseDetailComponent } from './detail/excercise-detail.component';
import { ExcerciseUpdateComponent } from './update/excercise-update.component';
import { ExcerciseDeleteDialogComponent } from './delete/excercise-delete-dialog.component';
import { ExcerciseRoutingModule } from './route/excercise-routing.module';

@NgModule({
  imports: [SharedModule, ExcerciseRoutingModule],
  declarations: [ExcerciseComponent, ExcerciseDetailComponent, ExcerciseUpdateComponent, ExcerciseDeleteDialogComponent],
  entryComponents: [ExcerciseDeleteDialogComponent],
})
export class ExcerciseModule {}
