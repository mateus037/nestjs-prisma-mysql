import { IsJWT } from "class-validator";
import { AuthLoginDTO } from "./auth-login-dto";
import { PickType } from "@nestjs/mapped-types";

export class AuthResetDTO extends PickType(AuthLoginDTO, ['password']) {

    @IsJWT()
    token: string;

}