import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { UserService } from "src/user/user.service";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RolehGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const ruleFilted = requiredRoles.filter(role => role === user.role)

        return ruleFilted.length > 0
    }

}