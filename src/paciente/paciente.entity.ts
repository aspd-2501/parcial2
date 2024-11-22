/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity';
import { MedicoEntity } from 'src/medico/medico.entity';

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
    @JoinTable()
    medicos: MedicoEntity[];
}
