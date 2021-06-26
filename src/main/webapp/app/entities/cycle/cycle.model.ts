import { IExcercise } from 'app/entities/excercise/excercise.model';

export interface ICycle {
  id?: number;
  reps?: number | null;
  volume?: number | null;
  excercise?: IExcercise | null;
}

export class Cycle implements ICycle {
  constructor(public id?: number, public reps?: number | null, public volume?: number | null, public excercise?: IExcercise | null) {}
}

export function getCycleIdentifier(cycle: ICycle): number | undefined {
  return cycle.id;
}
