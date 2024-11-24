/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DiagnosticoEntity } from './diagnostico.entity';
import { faker } from '@faker-js/faker';
import { DIAGNOSTICO_NOT_FOUND, DESCRIPTION_TOO_LONG } from '../shared/errors/error-messages';


describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticoList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticoList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.lorem.words(),
        descripcion: faker.lorem.sentence(),
        pacientes: [],
      });
      diagnosticoList.push(diagnostico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all diagnostics', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticoList.length);
  });

  it('findAll should return an empty array when there are no diagnostics', async () => {
    await repository.clear();
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(0);
  });

  it('findOne should return a diagnostic by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticoList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.id).toEqual(storedDiagnostico.id);
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an error when the diagnostic does not exist', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', DIAGNOSTICO_NOT_FOUND);
  });

  it ('create should create a new diagnostic', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: "",
      nombre: faker.lorem.words(),
      descripcion: faker.lorem.sentence(),
      pacientes: []
    }
    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({where: {id: newDiagnostico.id}, relations: ['pacientes']});
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.id).toEqual(newDiagnostico.id);
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
    expect(storedDiagnostico.pacientes).toEqual(newDiagnostico.pacientes);
  });

  it('create should throw an error when the description is too long', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: "",
      nombre: faker.lorem.words(),
      descripcion: "a".repeat(210),
      pacientes: []
    }
    await expect(service.create(diagnostico)).rejects.toHaveProperty('message', DESCRIPTION_TOO_LONG);
  });

  it ('delete should delete a diagnostic', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticoList[0];
    await service.delete(storedDiagnostico.id);
    const diagnostico: DiagnosticoEntity = await repository.findOne({where: {id: storedDiagnostico.id}});
    expect(diagnostico).toBeNull();
  });

  it('delete should throw an error when the diagnostic does not exist', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty('message', DIAGNOSTICO_NOT_FOUND);
  });

});
