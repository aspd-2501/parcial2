/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('medico')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}
}
