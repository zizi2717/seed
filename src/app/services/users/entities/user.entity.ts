import { Exclude } from 'class-transformer'
import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class User extends AggregateRoot {
    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column()
    name: string
}
