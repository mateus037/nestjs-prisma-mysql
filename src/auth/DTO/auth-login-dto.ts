import { PickType } from "@nestjs/mapped-types";
import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { AuthRegisterDTO } from "./auth-register-dto";

export class AuthLoginDTO extends PickType(AuthRegisterDTO, ['email','password']) {

}