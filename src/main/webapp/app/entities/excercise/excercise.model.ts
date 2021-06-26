import { ICycle } from 'app/entities/cycle/cycle.model';
import { IRoutine } from 'app/entities/routine/routine.model';
import { ExcerciseType } from 'app/entities/enumerations/excercise-type.model';

export interface IExcercise {
  id?: number;
  type?: ExcerciseType | null;
  currentVolume?: number | null;
  startingVolume?: number | null;
  goalVolume?: number | null;
  cycles?: ICycle[] | null;
  routine?: IRoutine | null;
}

export class Excercise implements IExcercise {
  constructor(
    public id?: number,
    public type?: ExcerciseType | null,
    public currentVolume?: number | null,
    public startingVolume?: number | null,
    public goalVolume?: number | null,
    public cycles?: ICycle[] | null,
    public routine?: IRoutine | null
  ) {}
}

export function getExcerciseIdentifier(excercise: IExcercise): number | undefined {
  return excercise.id;
}
