import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid corporate email address.' })
  @IsNotEmpty({ message: 'The email field cannot be left blank.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Your password must be at least 8 characters long.' })
  @IsNotEmpty({ message: 'The password field is required.' })
  password!: string;
}