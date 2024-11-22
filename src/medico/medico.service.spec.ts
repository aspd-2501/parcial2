/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MedicoEntity } from './medico.entity';
import { faker } from '@faker-js/faker';
import { MEDICO_NOT_FOUND, MEDIC_NAME_EMPTY, MEDIC_SPECIALTY_EMPTY, MEDIC_HAS_PATIENTS } from '../shared/errors/error-messages';
import { PacienteEntity } from '../paciente/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicoList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicoList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: [],
      });
      medicoList.push(medico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all medics', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicoList.length);
  });

  it('findAll should return an empty array when there are no medics', async () => {
    await repository.clear();
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(0);
  });

  it('findOne should return a medic by id', async () => {
    const storedMedico: MedicoEntity = medicoList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.id).toEqual(storedMedico.id);
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
    expect(medico.pacientes).toEqual(storedMedico.pacientes);
  });

  it ('findOne should throw an error when the medic is not found', async () => {
      await expect(service.findOne('0')).rejects.toHaveProperty('message', MEDICO_NOT_FOUND);
  });

  it('create should create a new medic', async () => {
    const medico: MedicoEntity = await service.create({
      id: "",
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    });
    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({where: {id: medico.id}, relations: ['pacientes']});
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.id).toEqual(newMedico.id);
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
    expect(storedMedico.pacientes).toEqual(newMedico.pacientes);
  });

  it('create should throw an error when the medic name is empty', async () => {
    await expect(service.create({
      id: "",
      nombre: "",
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    })).rejects.toHaveProperty('message', MEDIC_NAME_EMPTY);
  });

  it('create should throw an error when the medic specialty is empty', async () => {
    await expect(service.create({
      id: "",
      nombre: faker.person.fullName(),
      especialidad: "",
      telefono: faker.phone.number(),
      pacientes: [],
    })).rejects.toHaveProperty('message', MEDIC_SPECIALTY_EMPTY);
  });

  it('delete should remove a medic', async () => {
    const medico: MedicoEntity = medicoList[0];
    await service.delete(medico.id);
    const deletedMedico: MedicoEntity = await repository.findOne({where: {id: medico.id}});
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an error when the medic is not found', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty('message', MEDICO_NOT_FOUND);
  });

  it('delete should throw an error when the medic has patients', async () => {
    const medico: MedicoEntity = medicoList[0];
    const paciente: PacienteEntity = await repository.save({
      id: "",
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      medicos: medicoList,
      diagnosticos: []
    });

    medico.pacientes.push(paciente);
    await expect(service.delete(medico.id)).rejects.toHaveProperty('message', MEDIC_HAS_PATIENTS);
  });
});
