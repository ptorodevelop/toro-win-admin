import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PartnerService, Partner } from '../../services/partner.service';

@Component({
  selector: 'app-partner-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-form-modal.component.html'
})
export class PartnerFormModalComponent implements OnInit {
  @Input() partner: Partner | null = null;
  @Output() close = new EventEmitter<boolean>();

  form!: FormGroup;
  isSubmitting = false;

  private readonly fb = inject(FormBuilder);
  private readonly partnerService = inject(PartnerService);

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.partner?.name || '', [Validators.required]],
      document: [this.partner?.document || ''],
      phone: [this.partner?.phone || ''],
      code: [this.partner?.code || '', this.partner ? [Validators.required] : []], // Required si edita
      commission_type: [this.partner?.commission_type || 'percentage', [Validators.required]],
      commission_value: [this.partner?.commission_value || 0, [Validators.required, Validators.min(0)]],
      is_active: [this.partner ? this.partner.is_active : true]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const data = this.form.value;

    if (this.partner?.id) {
      this.partnerService.updatePartner(this.partner.id, data).subscribe({
        next: () => this.close.emit(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.partnerService.createPartner(data).subscribe({
        next: () => this.close.emit(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
