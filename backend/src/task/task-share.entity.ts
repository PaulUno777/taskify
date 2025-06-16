import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { User } from "src/user";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import { Task } from "./task.entity";

export enum SharePermission {
  VIEW = "VIEW",
  EDIT = "EDIT",
}

@Entity()
export class TaskShare extends AppBaseEntity {
  @Column({
    type: "text",
    enum: SharePermission,
    default: SharePermission.VIEW,
  })
  permission: SharePermission;

  @ManyToOne(() => User, (user) => user.sharedTasks, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Task, (user) => user.shares, { onDelete: "CASCADE" })
  task: Task;
}
