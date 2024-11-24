/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity';
import { faker } from '@faker-js/faker';
import { PACIENTE_NOT_FOUND, PATIENT_HAS_DIAGNOSTICS, PATIENT_NAME_TOO_SHORT } from '../shared/errors/error-messages';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacienteList: PacienteEntity[];
  let diagnosticoRepository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });


  const seedDatabase = async () => {

    repository.clear();
    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.fullName(),
        genero: faker.person.gender(),        
        medicos: [],
        diagnosticos: [],
      })
      pacienteList.push(paciente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all patients', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacienteList.length);
  });

  it('findAll should return an empty array when there are no patients', async () => {
    await repository.clear();
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(0);
  });

  it('findOne should return a patient by id', async () => {
    const storedPaciente: PacienteEntity = pacienteList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
    expect(paciente.medicos).toEqual(storedPaciente.medicos);
    expect(paciente.diagnosticos).toEqual(storedPaciente.diagnosticos);
  });

  it('findOne should throw an exception for an ivalid patient', async () => {
      await expect(service.findOne('0')).rejects.toHaveProperty('message', PACIENTE_NOT_FOUND);
  });

  it('create should return the new created patient', async () => {
    const Paciente: PacienteEntity = {
      id: "",
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: []
    }
    const newPaciente: PacienteEntity = await service.create(Paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({where: {id: newPaciente.id}, relations: ['medicos', 'diagnosticos']});
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.id).toEqual(newPaciente.id);
    expect(storedPaciente.nombre).toEqual(Paciente.nombre);
    expect(storedPaciente.genero).toEqual(Paciente.genero);
    expect(storedPaciente.medicos).toEqual(Paciente.medicos);
    expect(storedPaciente.diagnosticos).toEqual(Paciente.diagnosticos);
  });

  it('create should throw an exception when name has less than 3 characters', async () => {
    const Paciente: PacienteEntity = {
      id: "",
      nombre: "AB",
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: []
    }
    await expect(service.create(Paciente)).rejects.toHaveProperty('message', PATIENT_NAME_TOO_SHORT);
  });

  it ('delete should remove a patient', async () => {
    const paciente: PacienteEntity = pacienteList[0];
    await service.delete(paciente.id);
    const deletedPaciente: PacienteEntity = await repository.findOne({where: {id: paciente.id}});
    expect(deletedPaciente).toBeNull();
  });

  it ('delete should throw an exception when the patient has diagnostics associated to it', async () => {
    const paciente: PacienteEntity = pacienteList[0];

    const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      pacientes: [paciente],
    });  

    paciente.diagnosticos = [diagnostico];
    await expect(service.delete(paciente.id)).rejects.toHaveProperty('message', PATIENT_HAS_DIAGNOSTICS);
  });
});
