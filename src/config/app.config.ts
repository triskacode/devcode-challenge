import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 3030,
  cors: {
    origin: true,
    credentials: true,
  },
}));
