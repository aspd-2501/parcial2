/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DiagnosticoDto } from './diagnostico.dto';
import { DiagnosticoEntity } from './diagnostico.entity';
import { plainToInstance } from 'class-transformer';

@Controller('diagnostico')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoServices: DiagnosticoService) {}

    @Get()
    async findAll() {
        return await this.diagnosticoServices.findAll();
    }

    @Get(':diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string) {
        return await this.diagnosticoServices.findOne(diagnosticoId);
    }

    @Post()
    async create(@Body() diagnosticoDto: DiagnosticoDto) {
        const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
        return await this.diagnosticoServices.create(diagnostico);
    }

    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string) {
        return await this.diagnosticoServices.delete(diagnosticoId);
    }
}
