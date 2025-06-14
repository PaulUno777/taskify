import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { TaskCategory } from "src/task-category";
import { Task } from "src/task";
import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { TaskComment } from "src/task-comment";

@Entity()
export class User extends AppBaseEntity {
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];

  @ManyToMany(() => Task, (task) => task.sharedWith)
  sharedTasks: Task[];

  @OneToMany(() => TaskCategory, (category) => category.user)
  categories: TaskCategory[];

  @OneToMany(() => TaskComment, (comment) => comment.author)
  comments: TaskComment[];
}
