/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

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
        return await this.pacienteRepository.save(paciente);
    }

    async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
        await this.findOne(id);
        return await this.pacienteRepository.save(paciente);
    }

    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}});
        if (!paciente) {
            throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);
        }

        await this.pacienteRepository.remove(paciente);
    }

}