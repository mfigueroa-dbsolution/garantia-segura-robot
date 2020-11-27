import {
    Entity,
    PrimaryColumn,
} from 'typeorm';

@Entity()
export class User  {

    @PrimaryColumn()
    rut: string;


}
