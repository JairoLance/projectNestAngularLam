import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Get,
  Put,
  Param,
  Delete,
  Injectable,
  HttpServer
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from './employee.entity';
 

@Controller('employee')
@Injectable()
export class EmployeeController {
  constructor(private employeeService: EmployeeService ) {}

  @Get('all')
  public async getEmployee(): Promise<Employee[]> {
    console.log('Entrastes');
    let todos = await this.employeeService.getAll();

    return todos;
  }

  @Post('create')
  public async create(@Body() body): Promise<{ data: any; message: string }> {
    // return this.employeeService.create(body);
    try {
      const result = await this.employeeService.create(body);
      return { data: result.data, message: result.message };
    } catch (error) {
      return { data: null, message: 'Error creando empleado' };
    }
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: number,
    @Body() data: Partial<Employee>,
  ) {
    try {
      const updatedEmployee = await this.employeeService.updateEmployeeById(
        id,
        data,
      );
      return { success: true, data: updatedEmployee ,  message: 'Actualizado con exito !'  };
    } catch (error) {
      return { success: false, error: 'Internal Server Error' };
    }
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: number) {
    try {
      const result = await this.employeeService.deleteEmployeeById(id);
      return { success: true, message: 'Eliminado con exito !' };
    } catch (error) {
      return { success: false, error: 'Internal Server Error' };
    }
  }
}
