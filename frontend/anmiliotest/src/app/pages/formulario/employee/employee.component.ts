import { Component, OnInit } from '@angular/core';
import { ModelComponent } from '../shared/ui/model/model.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/formulario/employee.service';
import { IEmployee } from '../shared/models/Employee';
import { CryptoService } from '../../services/cryptografia';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ModelComponent, EmployeeFormComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  isModelOpen = false;
  employees: any = [];
  employee!: IEmployee;
  currentPage: number = 1;
  totalPages: number = 5;
  loading: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.loading = true;
    this.employeeService.getAllEmployee().subscribe(
      (response: any) => {
        console.log('es la data ', response);
        if (response) {
          let datas: any = [];
          response.forEach((res: any) => {
            console.log('filaas ', res['names']);

            let obj = {
              id: res['id'],
              names: this.cryptoService.decryptData(res['names']),
              surnames: this.cryptoService.decryptData(res['surnames']),
              document: this.cryptoService.decryptData(res['document']),
              phone: this.cryptoService.decryptData(res['phone']),
              address: this.cryptoService.decryptData(res['address']),
              typeDocument: res['typeDocument'],
              age: this.cryptoService.decryptData(res['age']),
              fecha: res['createdAt'],
              createdAt: res['createdAt'],
            };
            datas.push(obj);
          });

          this.employees = datas;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      },
      (error) => {
        console.error('Error:', error);
      },
      () => {
        setTimeout(() => {
          this.loading = false;
        }, 1000); // Oculta el spinner después de la carga (éxito o error)
      }
    );
  }

  loadEmployee(employee: IEmployee) {
    // let obj = {
    //   id: employee.id,
    //   names: this.cryptoService.decryptData(employee.names),
    //   surnames: this.cryptoService.decryptData(employee.names),
    //   document: this.cryptoService.decryptData(employee.names),
    //   phone: this.cryptoService.decryptData(employee.names),
    //   address: this.cryptoService.decryptData(employee.names),
    //   typeDocument: employee.typeDocument,
    //   age: employee.age,
    // };
    this.employee = employee;
    this.openModel();
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.getAllEmployee();
      },
    });
  }

  openModel() {
    this.isModelOpen = true;
  }

  closeModel() {
    this.isModelOpen = false;
    this.getAllEmployee();
  }

  getPagesFn(currentPage: number, totalPages: number): number[] {
    const pagesToShow = 5; // Puedes ajustar el número de páginas a mostrar según tus preferencias
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (totalPages <= pagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= halfPagesToShow) {
      startPage = 1;
      endPage = pagesToShow;
    } else if (currentPage + halfPagesToShow >= totalPages) {
      startPage = totalPages - pagesToShow + 1;
      endPage = totalPages;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  calculateOffset(currentPage: number, pageSize: number): number {
    return (currentPage - 1) * pageSize;
  }

  getPages(currentPage: number, totalPages: number): number[] {
    return this.getPagesFn(currentPage, totalPages);
  }

  changePage(newPage: number): void {
    // Lógica para cambiar de página
  }
}
