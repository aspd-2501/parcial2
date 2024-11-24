/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico/medico.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [MedicoModule, PacienteModule, DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'diagnosticos',
      entities: [MedicoEntity, DiagnosticoEntity, PacienteEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
