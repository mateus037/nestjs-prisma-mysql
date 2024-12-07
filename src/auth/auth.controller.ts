import { Body, Controller, Headers, Post, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDTO } from "./DTO/auth-login-dto";
import { AuthForgetDTO } from "./DTO/auth-forget-dto";
import { AuthResetDTO } from "./DTO/auth-reset-dto";
import { AuthService } from "./auth.service";
import { AuthRegisterDTO } from "./DTO/auth-register-dto";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
        private readonly fileService: FileService
    ) { }

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User("email") user) {
        return { user }
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({fileType: 'image/png'}),
            new MaxFileSizeValidator({maxSize: 1024 * 995})
        ]
    })) photo: Express.Multer.File) {

        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`)

        try {
            await this.fileService.upload(photo, path);
        } catch (error) {
            throw new BadRequestException(error);
        }

        return { success: true }
    }

    @UseInterceptors(FilesInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
        return files
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    },{
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, Documents: Express.Multer.File[]}) {
        console.table(files.photo)
        return files
    }
}