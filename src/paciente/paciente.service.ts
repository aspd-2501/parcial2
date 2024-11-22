/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PACIENTE_NOT_FOUND, PATIENT_HAS_DIAGNOSTICS, PATIENT_NAME_TOO_SHORT } from '../shared/errors/error-messages';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private pacienteRepository: Repository<PacienteEntity>,
    ) {}

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({ relations: ['medicos', 'diagnosticos'] });
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ['medicos', 'diagnosticos'] });
        if (!paciente) {
            throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);
        }
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (paciente.nombre.length < 3) {
            throw new BusinessLogicException(PATIENT_NAME_TOO_SHORT, BusinessError.BAD_REQUEST);
        }
        return await this.pacienteRepository.save(paciente);
    }

    async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
        await this.findOne(id);
        return await this.pacienteRepository.save(paciente);
    }

    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ['medicos', 'diagnosticos']});
        if (!paciente) {
            throw new BusinessLogicException(PACIENTE_NOT_FOUND, BusinessError.NOT_FOUND);
        }

        if (paciente.diagnosticos.length > 200) {
            throw new BusinessLogicException(PATIENT_HAS_DIAGNOSTICS, BusinessError.BAD_REQUEST);
        }

        await this.pacienteRepository.remove(paciente);
    }

}
