import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies['accessTokenDev'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    request.headers['authorization'] = `Bearer ${token}`

    return super.canActivate(context);
  }
}
