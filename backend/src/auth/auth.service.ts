import { AppDataSource } from "../shared/data/data-source";
import { DataCrypt } from "../shared/utils/data-crypt";
import { User } from "./user.entity";

export class UserService {
  private repository = AppDataSource.getRepository(User);

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {
    const passwordHash = await DataCrypt.encrypt(password);
    const user = this.repository.create({ email, firstName, lastName, passwordHash });
    return this.repository.save(user);
  }
}
