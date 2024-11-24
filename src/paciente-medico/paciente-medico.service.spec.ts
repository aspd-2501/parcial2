/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PACIENTE_NOT_FOUND, MEDICO_NOT_FOUND, MAXIMUM_FIVE_MEDICS } from '../shared/errors/error-messages';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicoList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();
    medicoList = [];

    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: [],
      });
      medicoList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.sex(),
      medicos: medicoList
    });
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medic to a patient', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
      });

    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.sex(),
      medicos: []
    });

    const result: PacienteEntity = await service.addMedicoToPaciente(newPaciente.id, newMedico.id);
    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0]).not.toBeNull();
    expect(result.medicos[0].id).toEqual(newMedico.id);
    expect(result.medicos[0].nombre).toEqual(newMedico.nombre);
    expect(result.medicos[0].especialidad).toEqual(newMedico.especialidad);
    expect(result.medicos[0].telefono).toEqual(newMedico.telefono);
  });

  it('addMedicoToPaciente should throw an error when the patient already has 5 medics', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    });

    await expect(() => service.addMedicoToPaciente(paciente.id, newMedico.id)).rejects.toHaveProperty('message', MAXIMUM_FIVE_MEDICS);
  });

  it('addMedicoToPaciente should throw an error when the madic is not found', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.sex(),
      medicos: []
    });

    await expect(() => service.addMedicoToPaciente(newPaciente.id, '0')).rejects.toHaveProperty('message', MEDICO_NOT_FOUND);
  });

  it('addMedicoToPaciente should throw an error when the patient is not found', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    });

    await expect(() => service.addMedicoToPaciente('0', newMedico.id)).rejects.toHaveProperty('message', PACIENTE_NOT_FOUND);
  });
});
