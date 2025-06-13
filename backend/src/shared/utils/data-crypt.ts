import bcrypt from "bcrypt";

export class DataCrypt {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashes a plain text password
   */
  static async encrypt(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(DataCrypt.SALT_ROUNDS);
    return bcrypt.hash(plainText, salt);
  }

  /**
   * Compares plain text password to hashed password
   */
  static async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
