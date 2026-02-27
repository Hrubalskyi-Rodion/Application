import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  date!: Date;

  @Column()
  location!: string;

  @Column({ nullable: true })
  capacity!: number;

  @Column({ default: 'public' })
  visibility!: string;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  organizer!: User;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  participants!: User[];
}
