/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('paciente-medico')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}
}
