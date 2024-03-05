import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IEmployee } from '../shared/models/Employee';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/formulario/employee.service'; //'../../services/employee.service';
import { CryptoService } from '../../services/cryptografia'; //'../../services/'
import { ToastrService } from 'ngx-toastr';
// src\app\pages\services\formulario\employee.service.ts
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnChanges {
  @Input() data: IEmployee | null = null;
  @Output() onCloseModel = new EventEmitter();

  employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private cryptoService: CryptoService
  ) {
    this.employeeForm = this.fb.group({
      // name: new FormControl('', [Validators.required]),
      // email: new FormControl('', [Validators.required, Validators.email]),
      // mobile: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
      // doj: new FormControl('', [Validators.required]),

      names: new FormControl('', [Validators.required]),
      surnames: new FormControl('', [Validators.required]),
      typeDocument: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
    });
  }

  onClose() {
    this.onCloseModel.emit(false);
  }

  ngOnChanges(): void {
    if (this.data) {
      this.employeeForm.patchValue({
        id: this.data.id,
        names: this.data.names,
        surnames: this.data.surnames,
        typeDocument: this.data.typeDocument,
        document: this.data.document,
        phone: this.data.phone,
        address: this.data.address,
        age: this.data.age,
        fecha: formatDate(this.data.createdAt, 'yyyy-MM-dd', 'en'),
      });

      //	id, names, surnames, "typeDocument", document, phone, address, age, "createdAt", "updatedAt")
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const encryptedData: any = {};

      console.log("antes de enviar ", this.employeeForm.value);
      // Cifrar cada campo del formulario
      Object.keys(this.employeeForm.value).forEach((key) => {
        if (key !== 'typeDocument') {
          encryptedData[key] = this.cryptoService.encryptData(
            this.employeeForm.get(key)?.value
          );
        } else {
          // Si es 'typeDocument', no cifrar, simplemente copiar el valor sin cambios
          encryptedData[key] = this.employeeForm.get(key)?.value;
        }
      });

      if (this.data) {
        this.employeeService
          .updateEmployee(this.data.id as string, encryptedData)
          .subscribe({
            next: (response: any) => {
              this.resetEmployeeForm();
              this.toastr.success(response.message);
            },
          });
      } else {
        this.employeeService.createEmployee(encryptedData).subscribe({
          next: (response: any) => {
            this.resetEmployeeForm();
            this.toastr.success(response.message);
          },
        });
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  resetEmployeeForm() {
    this.employeeForm.reset();
    this.onClose();
  }
}
