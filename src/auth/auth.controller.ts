import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('auth') // auth/regster
export class AuthController {
//     authService: AuthService

//     constructor(authService: AuthService){
//     this.authService = authService;
// }
// short way write code 
constructor(private readonly authService: AuthService) {}

@Post('register')
register(@Body() registerUserDto: RegisterDto) {
    // console.log("registerUserDto")
    const result = this.authService.registerUser(registerUserDto)
    return result
}

@Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

}
