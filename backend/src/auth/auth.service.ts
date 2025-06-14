import { JwtService, DataCrypt } from "@shared/utils";
import { userRepository, userService } from "src/user";
import { UnauthorizedError } from "@shared/errors";

export class AuthService {
  static async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {
    return await userService.create(email, firstName, lastName, password);
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const match = await DataCrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const payload = { userId: user.id, email: user.email };

    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);

    //Store current refresh token
    user.refreshToken = refreshToken.token;
    await userRepository.save(user);

    return { accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token.");
    }

    const payload = JwtService.verifyToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const user = await userService.findOneById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const newAccessToken = JwtService.generateAccessToken(payload);
    const newRefreshToken = JwtService.generateRefreshToken(payload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
