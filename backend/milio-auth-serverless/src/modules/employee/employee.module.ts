import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { employeeProviders } from './employee.providers';
import { EmployeeController } from './employee.controller';

@Module({
  providers: [EmployeeService, ...employeeProviders],
  exports: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
