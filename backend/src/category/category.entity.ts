import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Task } from "src/task/task.entity";
import { User } from "src/user";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Category extends AppBaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 10 })
  color: string; // Hex color code

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}
