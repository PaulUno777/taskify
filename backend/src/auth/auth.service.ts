import { JwtService, DataCrypt, JwtPayload } from "@shared/utils";
import { userRepository, userService } from "src/user";
import { UnauthorizedError } from "@shared/errors";

export class AuthService {
  static async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {
    const user = await userService.create({
      email,
      firstName,
      lastName,
      password,
    });
    return { message: "Account created successfully!", data: user };
  }

  static async getProfile(userId: string) {
    return await userService.findOneById(userId);
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

    return { access: accessToken, refresh: refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token.");
    }

    const payload = JwtService.decodeToken(refreshToken) as JwtPayload;
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const { userId, email } = payload;

    const user = await userService.findOne(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }
    const newAccessToken = JwtService.generateAccessToken({ email, userId });
    const newRefreshToken = JwtService.generateRefreshToken({ email, userId });

    //Store current refresh token
    user.refreshToken = newRefreshToken.token;
    await userRepository.save(user);

    return { access: newAccessToken, refresh: newRefreshToken };
  }
}
