import { Global, Module } from '@nestjs/common';
import { PasswordBcryptUtil } from './password-bcrypt.util';

@Global()
@Module({
  imports: [],
  providers: [PasswordBcryptUtil],
  exports: [PasswordBcryptUtil],
})
export class CommonModule {}
