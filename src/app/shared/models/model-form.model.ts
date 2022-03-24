import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export type ModelFormSpec<T> = {
  [k in keyof T]?: [T[k], ValidatorFn[]];
};

export type ModelForm<T> = {
  [k in keyof T]: FormArray | FormControl;
};

export type ModelFormGroup<T> = FormGroup & {
  controls: ModelForm<T>;
  value: T;
};
