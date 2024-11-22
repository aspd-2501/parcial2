/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { DESCRIPTION_TOO_LONG, DIAGNOSTICO_NOT_FOUND } from '../shared/errors/error-messages';


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
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}, relations: ['pacientes'] });
        if (!diagnostico) {
            throw new BusinessLogicException(DIAGNOSTICO_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.descripcion.length > 200) {
            throw new BusinessLogicException(DESCRIPTION_TOO_LONG, BusinessError.BAD_REQUEST);
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        await this.findOne(id);
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}});
        if (!diagnostico) {
            throw new BusinessLogicException(DIAGNOSTICO_NOT_FOUND, BusinessError.NOT_FOUND);
        }

        await this.diagnosticoRepository.remove(diagnostico);
    }
}
