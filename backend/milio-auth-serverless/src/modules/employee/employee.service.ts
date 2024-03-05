import { Inject, Injectable, Module, NotFoundException } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EMPLOYEE_REPOSITORY } from '../../core/constants';
import { EmployeeDto } from './dto/employee.dto';
import { HttpModule, HttpService } from '@nestjs/axios';

import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { Console } from 'console';

@Injectable()
export class EmployeeService {
  [x: string]: any;

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: typeof Employee,
  ) {}

  async create(employee: any): Promise<{ data: Employee; message: string }> {
    // return await this.employeeRepository.create<Employee>(employee);
    try {
      //Desencriptar la información que viene del front (employee) y
      //enviar a la lambda la información para encriptar y devolver para guardar en DB

      const encryptedData = employee; // Obtén los datos cifrados del cuerpo de la solicitud

      const secretKey = process.env.CRYPT_SECRET_FRONT;
      const objectKeynew = {};

      Object.entries(employee).forEach(([key, value]) => {
        if (key != 'typeDocument') {
          const dec = CryptoJS.AES.decrypt(
            value.toString(),
            secretKey,
          ).toString(CryptoJS.enc.Utf8);
          objectKeynew[key] = dec;
        } else {
          objectKeynew[key] = value;
        }
      });

      const axiosConfig = {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      };

      //EJECUTAMOS LA LAMBDA QUE CREA DESDE EL FRONT

      objectKeynew['op'] = 'encriptar';
      let newDataEcr = {};
      const exeLamda = await this.encriptarAny(objectKeynew);

      exeLamda['typeDocument'] = objectKeynew['typeDocument'];

      const _employee = await this.employeeRepository.create<Employee>(
        exeLamda as Employee,
      );

      return { data: _employee, message: 'Empleado creado con exito  !' };
      // const _employee =
      //   await this.employeeRepository.create<Employee>(employee);
      // return { data: _employee, message: 'Empleado creado con exito !' };
    } catch (error) {
      throw new Error('Error creating employee');
    }
  }

  async encriptarAny(data: any): Promise<any> {
    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      };
      // Realiza una solicitud a la API que te devuelve datos encriptados
      const response = await axios.post(
        'https://ba5wn7xh74.execute-api.us-east-2.amazonaws.com/LambdaDesEnc',
        data,
        axiosConfig,
      );

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos encriptados');
    }
  }

  async getDesEncryptedData(data: any): Promise<any> {
    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      };
      // Realiza una solicitud a la API que te devuelve datos encriptados
      const response = await axios.post(
        'https://ba5wn7xh74.execute-api.us-east-2.amazonaws.com/LambdaDesEnc',
        data,
        axiosConfig,
      );
      console.log('vengo de aqui = ', response.data);
      // Retorna los datos de la respuesta
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos encriptados');
    }
  }

  //encriptar-front
  async EncriptarWithFronted(data: any): Promise<any> {
    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      };
      // Realiza una solicitud a la API que te devuelve datos encriptados
      const response = await axios.post(
        'https://ba5wn7xh74.execute-api.us-east-2.amazonaws.com/LambdaDesEnc',
        data,
        axiosConfig,
      );
      console.log('vengo de aqui = ', response.data);
      // Retorna los datos de la respuesta
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos encriptados');
    }
  }

  async getAll(): Promise<Employee[]> {
    const employees = await this.employeeRepository.findAll<Employee>();

    // Utiliza Promise.all para manejar las promesas de forma adecuada
    // Recorremos todo el el array del objeto para poder descriptar cada fila asociada
    // es necesario que se incluya una promesa all para el bakend nest js con type
    const decryptedEmployees = await Promise.all(
      employees.map(async (employee) => {
        let row = {};
        row['op'] = 'desencriptar';
        row['names'] = employee.names;
        row['surnames'] = employee.surnames;
        row['document'] = employee.document;
        row['phone'] = employee.phone;
        row['address'] = employee.address;
        row['age'] = employee.age;
        // los datos anteriores vienen del backend de la base de datos el cual esta encritada con
        // la clave del backend

        // descriptamos con la clave del backend y ejecutamos la 'LAMBDA' esta referenciad con
        // api-gateway para mayor facilidad

        //EJECUTAMOS LAMBDA
        const rows = await this.getDesEncryptedData(row);

        // en el paso anterior desecriptamos los datos que vienen del backend , ahora lo que hacemos
        // es encriptar lo que se descripto con el el backend , pero para enviarselo al ffronted con su
        // secret key y que sea el mismo front descriptando.

        //especificamos que funcion queremos que se ejecute , este es un plus , ya que se hizo la logica para
        //poder ejecutar varios metodos en un envio hacia la LAMBDA.
        rows['op'] = 'encriptar-front';

        //EJECUTAMOS LAMBDA
        const rowsEc = await this.EncriptarWithFronted(rows);

        return {
          ...employee,
          id: employee.id,
          names: rowsEc['names'],
          surnames: rowsEc['surnames'],
          document: rowsEc['document'],
          phone: rowsEc['phone'],
          address: rowsEc['address'],
          typeDocument: employee.typeDocument,
          age: rowsEc['age'],
          createdAt: employee.createdAt,
        } as Employee;
      }),
    );

    return decryptedEmployees;
  }

  async getAll1(): Promise<Employee[]> {
    return await this.employeeRepository.findAll<Employee>();
  }

  async updateEmployeeById(
    id: number,
    data: Partial<Employee>,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findByPk(id);

    if (!employee) {
      throw new Error('Employee not found');
    }

    const secretKey = process.env.CRYPT_SECRET_FRONT;
    const objectKeynew = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key != 'typeDocument') {
        const dec = CryptoJS.AES.decrypt(value.toString(), secretKey).toString(
          CryptoJS.enc.Utf8,
        );
        objectKeynew[key] = dec;
        console.log('datos descripton ' + key + ' : ' + dec);
      } else {
        objectKeynew[key] = value;
      }
    });

    objectKeynew['op'] = 'encriptar';
    let newDataEcr = {};
    const exeLamda = await this.encriptarAny(objectKeynew);
    console.log('antes', data.names);
    console.log('despues', exeLamda['names']);

    data.names = exeLamda['names'];
    data.surnames = exeLamda['surnames'];
    data.phone = exeLamda['phone'];
    data.document = exeLamda['document'];
    data.address = exeLamda['address'];
    data.age = exeLamda['age'];

    await employee.update(data);

    return employee;
  }

  async findOneByEmail(document: string): Promise<Employee> {
    return await this.employeeRepository.findOne<Employee>({
      where: { document },
    });
  }

  async findOneById(id: number): Promise<Employee> {
    return await this.employeeRepository.findOne<Employee>({ where: { id } });
  }

  async deleteEmployeeById(id: number): Promise<void> {
    const employee = await this.employeeRepository.destroy({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Empleado con id ${id} no existe`);
    }
  }
}
