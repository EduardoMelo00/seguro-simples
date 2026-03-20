import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IsString } from "class-validator";

class LoginDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const result = await this.service.validateBroker(dto.email, dto.password);
    if (!result) throw new UnauthorizedException("Credenciais invalidas");
    return result;
  }
}
