import { AppBaseEntity } from "@shared/entities/app-base.entity";
import { Entity, Column } from "typeorm";

@Entity()
export class User extends AppBaseEntity{
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
}
