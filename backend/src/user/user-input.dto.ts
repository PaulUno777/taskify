export class CreateUserDto {
  email: string;

  firstName: string;

  lastName: string;

  password: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
