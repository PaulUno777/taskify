import { DataCrypt } from "../shared/utils/data-crypt";
import { ConflictError, NotFoundError } from "@shared/errors";
import { User } from "./user.entity";
import { userRepository } from ".";

export class UserService {
  private repository = userRepository;

  async create(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User> {
    // Check if email exists
    const existingUser = await this.repository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictError("User with email already exists.");
    }

    // Encrypt the password
    const passwordHash = await DataCrypt.encrypt(password);

    const user = this.repository.create({
      email,
      firstName,
      lastName,
      passwordHash,
    });

    return await this.repository.save(user);
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }

  async update(id: string, user: Partial<User>): Promise<User>{
    const existingUser = await this.repository.findOneBy({ id });
    if (!existingUser)
      throw new NotFoundError("User not found.");
    return await this.repository.save({ ...existingUser, ...user });
  }

  // Add other user-related methods here, e.g. findOneByEmail, update, delete...
}