import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest();

    if (request.user) {

        const userInfo = filter ? request.user[filter] : request.user

        return userInfo
    } else {
        throw new NotFoundException("Usuário não encontrado no request. Use o AuthGuard para obter o usuário.")
    }
})