/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoService } from './medico/medico.service';
import { PacienteController } from './paciente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
  providers: [PacienteService, MedicoService],
  controllers: [PacienteController]
})
export class PacienteModule {}
