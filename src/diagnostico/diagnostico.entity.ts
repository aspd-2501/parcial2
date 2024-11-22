/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';

@Entity('diagnostico')
export class DiagnosticoEntity {
    
        @PrimaryGeneratedColumn('uuid')
        id: string;
    
        @Column()
        nombre: string;
    
        @Column()
        descripcion: string;
    

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    @JoinTable()
    pacientes: PacienteEntity[];
}
