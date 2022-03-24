import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createProduct } from '../../../shared/api/models/model-factory';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelFormGroup } from '../../../shared/models/model-form.model';
import { Product } from '../../../shared/api/models/product.model';
import { BehaviorSubject } from 'rxjs';
import { SalesViewService } from '../../../sales/services/sales-view.service';
import { getBrowserLocaleDateFormat, NumericValidator } from '../../../shared/utils/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../shared/services/feedback.service';

@Component({
  selector: 'grow-app-product-new',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
  readonly form: ModelFormGroup<Product> = <ModelFormGroup<Product>> this.fb.group({});
  readonly showValidationFeedback$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly browserLocaleDateFormat: string = getBrowserLocaleDateFormat();

  constructor(private readonly fb: FormBuilder,
              private readonly viewService: SalesViewService,
              private readonly feedbackService: FeedbackService,
              private readonly router: Router) {
    this.buildForm();
  }

  save() {
    if (this.form.valid) {
      this.viewService.addProduct(this.form.value);
      this.feedbackService.success(`Potato product ${this.form.controls.name.value}` +
                                   `(ID: ${this.form.controls.id.value}) successfully added`);
      this.router.navigateByUrl('/home');
    } else {
      this.showValidationFeedback$.next(true);
    }
  }

  reset() {
    this.form.reset(createProduct());
    this.showValidationFeedback$.next(false);
  }

  private buildForm() {
    const newProduct = createProduct();
    Object.keys(newProduct).forEach(k => {
      this.form.addControl(k, this.fb.control(newProduct[k], []));
    });

    this.form.controls.id.setValidators([
      Validators.required,
      Validators.maxLength(13),
      NumericValidator]);
    this.form.controls.name.setValidators(([
      Validators.required,
      Validators.maxLength(50)]));
    this.form.controls.salesStartDate.setValidators([
      Validators.required,
      Validators.maxLength(10),
      (control: FormControl) => {
        try {
          (new Date(control.value)).valueOf();
        } catch (e) {
          return {
            date: true,
          };
        }}]);
    this.form.controls.manager.setValidators([Validators.maxLength(30)]);
  }
}
