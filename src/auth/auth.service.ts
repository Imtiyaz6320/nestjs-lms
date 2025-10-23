// import { Injectable } from '@nestjs/common';
// import { UserService } from 'src/user/user.service';
// import { RegisterDto } from './dto/registerUser.dto';
// import bcrypt from "bcrypt";
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//     constructor(private readonly userService: UserService,
//         private readonly jwtService: JwtService,
//     ) { }
//     async registerUser(registerUserDto: RegisterDto) {
//         const saltRounds = 10
//         const hash = await bcrypt.hash(registerUserDto.password, saltRounds)
//         const user = await this.userService.createUser({
//             ...registerUserDto,
//             password: hash,
//         });
//         // return user

//         const payload = { sub: user._id};
//         const token = await this.jwtService.signAsync(payload)
//         console.log(token);
//         return ({secretToken :token}) 

//     }
// }


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Register user
  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    const payload = { sub: user._id, email: user.email}; //role: 'admin'
    const token = await this.jwtService.signAsync(payload);

    return { message: 'User registered successfully', token };
  }

  // Login user
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // 1. Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Create JWT payload
    const payload = { sub: user._id, email: user.email};   //role: 'admin'
    const token = await this.jwtService.signAsync(payload);

    // 4. Return success + token
    const { password: _, ...userWithoutPassword } = user.toObject();
    return { message: 'Login successful', token, user: userWithoutPassword };
  }
}
