import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Category } from "src/category";
import { Task } from "src/task";
import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { Comment } from "src/comment";

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

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
