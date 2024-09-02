import { Exclude } from 'class-transformer'
import { TypeormEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity()
export class User extends TypeormEntity {
    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column()
    name: string
}
