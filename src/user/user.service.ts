import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

     async create({email, name, password}: CreateUserDTO) {

        const salt = await bcrypt.genSalt()
        
        password = await bcrypt.hash(password, salt);
        
        return await this.prisma.user.create({
            data: {
                email,
                name,
                password
            }
         });
     }

     async list() {
        return await this.prisma.user.findMany();
     }

     async findOne(id: number) {
        await this.exists(id);
        
        return await this.prisma.user.findUnique({
            where: {
                id,
            }
        });
     }

     async update(id: number, {email, name, password, birthAt, role}: UpdatePutUserDTO) {

        await this.exists(id);

        const salt = await bcrypt.genSalt()
        
        password = await bcrypt.hash(password, salt);

        return this.prisma.user.update({
            data:{email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role}, 
            where:{
                id
            }
        })
     }

     async updatePartial(id: number, data: UpdatePatchUserDTO) {

        await this.exists(id);

        if (data.password) {
            const salt = await bcrypt.genSalt()
            data.password = await bcrypt.hash(data.password, salt);
        }

        return this.prisma.user.update({
            data, 
            where:{
                id
            }
        })
     }

     async delete(id: number) {

        await this.exists(id);

        return this.prisma.user.delete({where:{
            id
        }});
     }

     async exists(id: number){
        const findId = await this.prisma.user.count({
            where: {
                id
            }
        })
        if(!findId){
            throw new NotFoundException(`The id ${id} not exist`);
        }
     }
}