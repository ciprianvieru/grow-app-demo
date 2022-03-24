import { AbstractControl } from '@angular/forms';

export function NumericValidator(control: AbstractControl) {
  if (!/^\d+$/.test(<string>control.value)) {
    return { numeric: true };
  }
}

export function getBrowserLocaleDateFormat() {
  const locale = navigator.languages && navigator.languages.length > 0
                  ? navigator.languages[0]
                  : (navigator.language || (<any>navigator).userLanguage);
  const formatObj = new Intl.DateTimeFormat(locale).formatToParts(new Date());

  return formatObj
    .map(obj => {
      switch (obj.type) {
        case 'day':
          return 'DD';
        case 'month':
          return 'MM';
        case 'year':
          return 'YYYY';
        default:
          return obj.value;
      }
    })
    .join('');
}
