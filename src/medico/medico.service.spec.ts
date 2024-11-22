/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';

import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
