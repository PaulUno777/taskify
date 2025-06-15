import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Category } from "src/category";
import { User, UserDto } from "src/user";
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Comment } from "src/comment";

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

@Entity()
export class Task extends AppBaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column("text")
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: "text", enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  owner: User;

  @ManyToOne(() => Category, (category) => category.tasks, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  category: Category;

  @ManyToMany(() => User, (user) => user.sharedTasks)
  @JoinTable()
  sharedWith: User[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
