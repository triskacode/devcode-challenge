import { Activity } from 'src/modules/activity/entities/activity.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Priority } from '../todo.types';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('enum', { enum: Priority, default: Priority.VeryHigh })
  priority: Priority;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Activity, (entity: Activity) => entity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_group_id' })
  activity: Activity;

  @Column({ name: 'activity_group_id' })
  @Index()
  activity_group_id: Activity['id'];
}
