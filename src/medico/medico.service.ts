/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';


@Injectable()
export class MedicoService {
    constructor(        
        @InjectRepository(MedicoEntity)
        private medicoRepository: Repository<MedicoEntity>,
    ) { }

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['medicos', 'diagnosticos'] });
        if (!medico) {
            throw new BusinessLogicException('The medic with the given id was not found', BusinessError.NOT_FOUND);
        }
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        return await this.medicoRepository.save(medico);
    }

    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
        await this.findOne(id);
        return await this.medicoRepository.save(medico);
    }

    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}});
        if (!medico) {
            throw new BusinessLogicException('The medic with the given id was not found', BusinessError.NOT_FOUND);
        }

        await this.medicoRepository.remove(medico);
    }
}
