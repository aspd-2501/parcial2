/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}
}
