import { FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as moment from 'moment';

import { FundingTypeRepository } from '../../repository/funding-type.repository';
import { FundingType } from '../../repository/project.interface';

export function dateStudyTypeValidator(compared: string, projectTypes): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } => {
        const valeur = control.value
        const group = control.parent;
        let valid = true;
        if (group !== undefined && valeur !== null && projectTypes) {
            console.log(projectTypes)
            const idx = projectTypes.findIndex(e => e['@id'] == valeur);
            console.log(group, control, idx)
        	const comparedDate = group.controls[compared].value;
            console.log(
                moment(comparedDate).format('YYYY-MM-DD'), 
                moment(valeur.applicationDebut).format('YYYY-MM-DD'), 
                moment(valeur.applicationFin).format('YYYY-MM-DD'), 
                moment(comparedDate).isBetween(moment(valeur.applicationDebut), moment(valeur.applicationFin))
            );
        	valid = moment(comparedDate).isBetween(moment(valeur.applicationDebut), moment(valeur.applicationFin));
        }

		return valid ? null : { 'dateStudyTypeError': true };
	};
}


export const dateFundingTypeAsyncValidator = 
  (compared: string, projectTypeR: FundingTypeRepository) => {
    return (control: FormControl) => {
      //recuperation du formulaire parent
      const group = control.parent;
      if (!group || control.value === null) {
        return of(null);
      }

      return projectTypeR.get(control.value)
              .pipe(
                map(res => {
                  if (
                    moment(group.controls[compared].value).isSameOrAfter(res.applicationDebut) &&
                    moment(group.controls[compared].value).isSameOrBefore(res.applicationFin||[])
                  ) {
                    return null;
                  } else {
                    return {'dateStudyTypeError': true}
                  }
                })
              );
    };
  };