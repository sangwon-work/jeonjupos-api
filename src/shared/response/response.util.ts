import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseUtil {
  private res: any;
  private statusCode: number;
  private rescode: string;
  private message: string;
  private body: any;

  messageUtil(rescode: string) {
    const message = {
      // status 200
      '0000': '성공',
      '0001': '관리자를 찾을 수 없습니다. mid 를 확인해주세요.',
      '0002': '테이블을 찾을 수 없습니다.',
      '0003': '메뉴를 찾을 수 없습니다.',
      '0004': '주문서를 찾을 수 없습니다.',
      '0005': '결제정보를 찾을 수 없습니다.',
      '0006': '결제금액이 맞지 않습니다.',
      '0007': '부분결제 완료',
      '0008': '',
      '0009': '',
      '00010': '',
      '00011': '',
      '00012': '',
      '00013': '',

      // status 400
      '4000': '파라미터 유효성 검증 실페',

      // status 401
      '8999': '토큰 형식이 올바르지 않습니다.',
      '8998': '토큰 type 이 올바르지 않습니다.',
      '8997': '토큰으로 회원을 찾을 수 없습니다.',
      '8996': '탈퇴한 회원입니다.',
      '8995': '비밀번호가 일치하지 않습니다.',

      // status 409

      // status 500
      '9999': '서버오류',
      '9998': 'DB 오류',
    };
    return message[rescode];
  }

  response(
    res: Response,
    statusCode: number,
    rescode: string,
    message: string,
    body: object,
  ): Response {
    this.res = res;
    this.statusCode = statusCode;
    this.rescode = rescode;
    this.body = body;
    this.message =
      message === ''
        ? this.messageUtil(rescode) !== undefined
          ? this.messageUtil(rescode)
          : ''
        : message;

    return this.res
      .status(this.statusCode)
      .json({ rescode: this.rescode, message: this.message, body: this.body });
  }
}
