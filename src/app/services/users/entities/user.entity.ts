import { Exclude } from 'class-transformer'
import { TypeormEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class User extends TypeormEntity {
    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column()
    name: string
}
