/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity('medico')
export class MedicoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    especialidad: string;

    @Column({ length: 10 })
    telefono: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.medicos)
    @JoinTable()
    pacientes: PacienteEntity[];
}
