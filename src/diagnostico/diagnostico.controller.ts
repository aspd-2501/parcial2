/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('diagnostico')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoServices: DiagnosticoService) {}
}
