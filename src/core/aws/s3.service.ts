
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../configuration/configuration.interface';

// sharp

@Injectable()
export class S3Service {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;
  private readonly validMimeType = ['image/jpg', 'image/png', 'image/jpeg'];

  constructor(private readonly configService: ConfigService) {
    const awsConfig =
      this.configService.get<Configuration['awsconfig']>('awsconfig');
    this.awsS3 = new AWS.S3({
      credentials: {
        accessKeyId: awsConfig.awsAccessKeyId,
        secretAccessKey: awsConfig.awsSecretAccessKey,
      },
      region: awsConfig.s3Region,
    });
    this.S3_BUCKET_NAME = awsConfig.s3Bucket;
  }

  /**
   * 이미지 업로드
   * @param folder
   * @param file
   */
  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
    url: string;
  }> {
    try {
      const validMimeType = this.validMimeType.filter(
        (mineType) => mineType === file.mimetype,
      );
      if (validMimeType.length === 0) {
        throw new BadRequestException(
          `${this.validMimeType.join(', ')}만 저장할 수 있습니다.`,
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException(`유효 이미지 용량은 5MB 이하입니다.`);
      }
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');
      // 공백을 제거해주는 정규식

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      const imgUrl = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      return { key, s3Object, contentType: file.mimetype, url: imgUrl };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  /**
   * 이미지 삭제
   * @param key
   * @param callback
   */
  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  /**
   * 이미지 url 가져오기
   * @param objectKey
   */
  public getAwsS3FileUrl(objectKey: string): string {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }
}
