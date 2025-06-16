import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Category } from "src/category";
import { Task } from "src/task";
import { Entity, Column, OneToMany } from "typeorm";
import { Message } from "src/message";
import { TaskShare } from "src/task";

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

  @OneToMany(() => TaskShare, (ts) => ts.user)
  sharedTasks: TaskShare[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Message, (comment) => comment.author)
  comments: Message[];
}
