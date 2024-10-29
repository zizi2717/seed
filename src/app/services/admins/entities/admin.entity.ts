import { Exclude } from 'class-transformer'
import { AggregateRoot } from 'common'
import { Column, Entity } from 'typeorm'

@Entity('admins')
export class Admin extends AggregateRoot {
    @Column({ unique: true })
    email: string

    @Column()
    name: string

    @Column()
    @Exclude()
    password: string
}
