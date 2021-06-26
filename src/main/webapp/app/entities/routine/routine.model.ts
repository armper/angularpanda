import * as dayjs from 'dayjs';
import { IExcercise } from 'app/entities/excercise/excercise.model';
import { IUser } from 'app/entities/user/user.model';

export interface IRoutine {
  id?: number;
  name?: string | null;
  dateStarted?: dayjs.Dayjs | null;
  dateEnded?: dayjs.Dayjs | null;
  goalDate?: dayjs.Dayjs | null;
  startingBodyWeight?: number | null;
  endingBodyWeight?: number | null;
  excercises?: IExcercise[] | null;
  users?: IUser[] | null;
}

export class Routine implements IRoutine {
  constructor(
    public id?: number,
    public name?: string | null,
    public dateStarted?: dayjs.Dayjs | null,
    public dateEnded?: dayjs.Dayjs | null,
    public goalDate?: dayjs.Dayjs | null,
    public startingBodyWeight?: number | null,
    public endingBodyWeight?: number | null,
    public excercises?: IExcercise[] | null,
    public users?: IUser[] | null
  ) {}
}

export function getRoutineIdentifier(routine: IRoutine): number | undefined {
  return routine.id;
}
