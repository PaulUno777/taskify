import { User, UserDto } from "src/user";

export class UserMapper {
    static toDto(user: User): UserDto {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
  }