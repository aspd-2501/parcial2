/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
import { MedicoEntity } from '../medico/medico.entity';

@Entity('paciente')
export class PacienteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];
}
