import { AuthLoginDTO } from "./auth-login-dto";
import { PickType } from "@nestjs/mapped-types";

export class AuthForgetDTO extends PickType(AuthLoginDTO, ['email']) {

}