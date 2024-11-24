/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';

@Module({
  providers: [PacienteMedicoService],
  imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
})
export class PacienteMedicoModule {}
