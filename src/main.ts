import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 활성화
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // decorator(@)가 없는 속성이 들어오면 해당 속성은 제거하고 받아들입니다.
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 넘어오면 request 자체를 막습니다. true인 경우) 정의되지 않은 property를 전송하려고 하면 다음과 같이 400 에러가 뜹니다.
      transform: true, // 클라이언트에서 값을 받자마자 타입을 정의한대로 자동 형변환을 합니다.
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true }, // 암묵적으로 타입을 변환 시켜줌
    }),
  );

  /**
   * app.setGlobalPrefix('api');
   * 전역 경로 접두어(global path prefix)
   * 컨트롤러나 라우트 수준에서 설정해준 경로는 버전 다음에 나오지만, 전역 경로 접두어는 버전 앞에 나옵니다.
   * http://localhost:3000/api/v?/~
   */
  // app.setGlobalPrefix('api');
  /**
   * enableVersioning
   * URL 경로에 버전을 명시하는 VersioningType.URI
   * ex) @Controller({ path: "hello", version: "1" })
   *
   * defaultVersion
   * 애플리케이션 수준에서 기본으로 사용될 버전을 설정해줄 수도 있는데요.
   * 이렇게 설정해준 버전은 컨트롤러나 라우트 수준에서 버전을 설정해주지 않았을 때 적용되게 됩니다.
   * defaultVersion: '3'
   * ex) http://localhost:3000/v3/~
   *
   * defaultVersion 을 설정 후에 @Controller({ path: "hello", version: "1" })
   * 사용시 Controller 에 설정한 버전을 따른다.
   */
  app.enableVersioning({
    type: VersioningType.URI,
    // defaultVersion: '3',
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('SERVER_PORT');
  await app.listen(PORT || 3000);

  // 개발 환경에서 실행했을때 logger 찍기
  if (configService.get('NODE_ENV') === 'development') {
    Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
  }
}
bootstrap();
