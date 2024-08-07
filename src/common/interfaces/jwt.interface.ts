import { JwtVerifyOptions } from '@nestjs/jwt';
import { DecodeOptions } from 'jsonwebtoken';

export interface IJwtDecodeOptions {
  decodeOptions?: DecodeOptions;
  jwtVerifyOptions?: JwtVerifyOptions;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}
