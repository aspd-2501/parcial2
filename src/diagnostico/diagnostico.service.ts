/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private diagnosticoRepository: Repository<DiagnosticoEntity>,
    ) {}

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}, relations: ['diagnosticos', 'diagnosticos'] });
        if (!diagnostico) {
            throw new BusinessLogicException('The medic with the given id was not found', BusinessError.NOT_FOUND);
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        await this.findOne(id);
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}});
        if (!diagnostico) {
            throw new BusinessLogicException('The medic with the given id was not found', BusinessError.NOT_FOUND);
        }

        await this.diagnosticoRepository.remove(diagnostico);
    }
}
