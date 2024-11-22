/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { MEDICO_NOT_FOUND, MEDIC_HAS_PATIENTS, MEDIC_NAME_EMPTY, MEDIC_SPECIALTY_EMPTY } from '../shared/errors/error-messages';


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
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['pacientes'] });
        if (!medico) {
            throw new BusinessLogicException(MEDICO_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if (medico.nombre.length == 0) {
            throw new BusinessLogicException(MEDIC_NAME_EMPTY, BusinessError.BAD_REQUEST);
        }

        if (medico.especialidad.length == 0) {
            throw new BusinessLogicException(MEDIC_SPECIALTY_EMPTY, BusinessError.BAD_REQUEST);
        }
        
        return await this.medicoRepository.save(medico);
    }

    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
        await this.findOne(id);
        return await this.medicoRepository.save(medico);
    }

    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['pacientes']});
        if (!medico) {
            throw new BusinessLogicException(MEDICO_NOT_FOUND, BusinessError.NOT_FOUND);
        }

        if (medico.pacientes.length > 0) {
            throw new BusinessLogicException(MEDIC_HAS_PATIENTS, BusinessError.BAD_REQUEST);
        }

        await this.medicoRepository.remove(medico);
    }
}
