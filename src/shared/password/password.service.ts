import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const PEPPER = '39dfnkvni@if9(df!i3ir9eok#'; // 사용 여부를 프로젝트 표준으로 고정

@Injectable()
export class PasswordService {
  async hashing(password: string): Promise<string> {
    const pwd: string = password + PEPPER;
    return await bcrypt.hash(pwd, 12); // genSalt 별도 호출 불필요
  }

  async checking(plaintext: string, hashtext: string): Promise<boolean> {
    const toCompare = plaintext + PEPPER;
    return await bcrypt.compare(toCompare, hashtext);
  }
}
