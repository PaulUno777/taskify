import { DataCrypt } from "../shared/utils/data-crypt";
import { ConflictError, NotFoundError } from "@shared/errors";
import { User } from "./user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserMapper,
  userRepository,
} from ".";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class UserService {
  private repository = userRepository;

  async create({
    email,
    firstName,
    lastName,
    password,
  }: CreateUserDto): Promise<StandardOutputDto> {
    // Check if email exists
    const existingUser = await this.repository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictError("User with email already exists.");
    }

    // Encrypt the password
    const passwordHash = await DataCrypt.encrypt(password);

    const user = await this.repository.save(
      this.repository.create({
        email,
        firstName,
        lastName,
        passwordHash,
      })
    );

    return {
      message: "User successfully created.",
      data: UserMapper.toDto(user),
    };
  }

  async findOneById(id: string): Promise<UserDto> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return UserMapper.toDto(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async update(id: string, user: UpdateUserDto): Promise<StandardOutputDto> {
    const existingUser = await this.repository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundError("User not found.");
    }

    if (user.password) {
      const passwordHash = await DataCrypt.encrypt(user.password);
      existingUser.passwordHash = passwordHash;
      delete user.password;
    }

    const updatedUser = await this.repository.save({
      ...existingUser,
      ...user,
    });
    return {
      message: "User successfully updated.",
      data: UserMapper.toDto(updatedUser),
    };
  }
}
