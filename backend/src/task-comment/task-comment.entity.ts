import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Task } from "src/task";
import { User } from "src/user";
import { Entity, Column, ManyToOne } from "typeorm";

@Entity()
export class TaskComment extends AppBaseEntity {
  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  author: User;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: "CASCADE" })
  task: Task;
}
