/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {

    repository.clear();
    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save();
      paciente.nombre = `Paciente ${i}`;
      paciente.genero = 20 + i;
      pacienteList.push(await repository.save(paciente));
    }
});
