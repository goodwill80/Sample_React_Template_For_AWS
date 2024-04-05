import { AuthService } from './AuthService';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DataStack } from '../../../cdk-starter-api/outputs.json';

const awsRegion = 'ap-southeast-1';
export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  // 1. Create Space Method
  public async createSpace(name: string, location: string, photo?: File) {
    if (photo) {
      const uploadURl = await this.uploadPublicFile(photo);
      console.log(uploadURl);
    }

    return { name, location, photo };
  }

  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        credentials: credentials as any,
        region: awsRegion,
      });
    }
    const command = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      // ACL: 'bucket-owner-full-control',
      Body: file,
    });

    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${awsRegion}.amazonaws.com/${command.input.Key}`;
  }

  // 3. Check if the request is authorised
  public isAuthorized() {
    return true;
  }
}
