import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ApiResponse, IEmployee } from '../pages/shared/models/Employee';
import {
  ApiResponse,
  IEmployee,
} from '../../formulario/shared/models/Employee';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiurl = `${environment.apiURL}/api/v1/employee`;
  constructor(private http: HttpClient) {}

  getAllEmployee(): Observable<ApiResponse<IEmployee[]>> {
    return this.http.get<ApiResponse<IEmployee[]>>(`${this.apiurl}/all`);
  }

  getEmployee(id: string): Observable<ApiResponse<IEmployee>> {
    return this.http.get<ApiResponse<IEmployee>>(`${this.apiurl}/${id}`);
  }

  createEmployee(employee: IEmployee): Observable<any> {
    return this.http.post(`${this.apiurl}/create`, employee);
  }

  updateEmployee(id: string, employee: IEmployee): Observable<any> {
    return this.http.put(`${this.apiurl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiurl}/${id}`);
  }
}
