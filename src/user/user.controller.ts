import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UserService } from "./user.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { Role } from "src/enums/role.enum";
import { Roles } from "src/decorators/role.decorator";
import { RolehGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolehGuard)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() data: CreateUserDTO) {
      return await this.userService.create(data);
    }

    @Get()
    async list() {
        return await this.userService.list();
    }

    @Get(':id')
    async readOne(@Param('id', ParseIntPipe) id: number){
    return await this.userService.findOne(id);
    }
  
    @Put(':id')
    async update(@Body()  data:UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number){
    return this.userService.update(id,data)
    }

    @Patch(':id') 
    async updatePartial(@Body() data:UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
        return this.userService.updatePartial(id,data)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}