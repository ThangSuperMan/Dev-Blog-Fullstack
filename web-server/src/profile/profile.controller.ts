// import { Body, Controller, Get, Logger, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '../auth/auth.guard';
// import { AuthService } from 'src/auth/auth.service';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';

// @Controller('profile')
// export class ProfileController {
//   constructor(private authService: AuthService) {}

// // @UseGuards(AuthGuard)
// @Get()
// index(@Body() user: CreateUserDto) {
//   Logger.log('/profile');
//   console.log('user :>> ', user);
//   const profileUser = {
//     name: 'Thang Handsome',
//     numberOfPosts: 5,
//     numberOfLikes: 100,
//   };
//   return { profileData: profileUser };
// }
// }
