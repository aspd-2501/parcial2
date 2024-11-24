/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PACIENTE_NOT_FOUND, MEDICO_NOT_FOUND, MAXIMUM_FIVE_MEDICS } from '../shared/errors/error-messages';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private pacienteRepository: Repository<PacienteEntity>,

        @InjectRepository(MedicoEntity)
        private medicoRepository: Repository<MedicoEntity>,
    ) {}

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const paciente = await this.pacienteRepository.findOne({where: {id: pacienteId}, relations: ['medicos']});
        const medico = await this.medicoRepository.findOne({where: {id: medicoId}});
        if (!paciente) {
            throw new BusinessLogicException(PACIENTE_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        if (!medico) {
            throw new BusinessLogicException(MEDICO_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        if (paciente.medicos.length >= 5) {
            throw new BusinessLogicException(MAXIMUM_FIVE_MEDICS, BusinessError.BAD_REQUEST);
        }
        paciente.medicos.push(medico);
        return await this.pacienteRepository.save(paciente);
    }
}
