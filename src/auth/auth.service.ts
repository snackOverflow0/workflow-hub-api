import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async registerUser(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existingUser) throw new ConflictException('This email address is already bound to an active account.')

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash
      },
      select: {
        id: true,
        email: true,
        globalRole: true,
        createdAt: true
      }
    })

    return newUser
  }

  async loginUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials provided.')

    const passwordMatches = await bcrypt.hash(dto.password, user.password)
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials provided.')

    const tokens = await this.getTokens(user.id, user.email, user.globalRole)
    await this.updateRefreshTokenStorageHash(user.id, tokens.refreshToken)

    return tokens
  }

  // UTILITY METHOD: COMPILE ACCESS AND REFRESH TOKENS
  private async getTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }

    // Fire dual asynchronous signing executions concurrently to speed up response times
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m'
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      })
    ])

    return { accessToken, refreshToken }
  }

  // UTILITY METHOD: HASH AND STORE THE ACTIVE REFRESH TOKEN
  private async updateRefreshTokenStorageHash(userId: string, refreshToken: string) {
    const hashValue = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: hashValue
      }
    })
  }
}
