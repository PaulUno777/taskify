import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Category } from "src/category";
import { User } from "src/user";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Message } from "src/message";
import { TaskShare } from "./task-share.entity";

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

  @OneToMany(() => TaskShare, (ts) => ts.task)
  shares: TaskShare[];

  @OneToMany(() => Message, (comment) => comment.task)
  comments: Message[];
}
