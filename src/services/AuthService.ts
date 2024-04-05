import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import { AuthStack } from "../../../AWS_CDK_STARTER_API/outputs.json";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// Initialise Amplify API to communicate with AWS cognito - by passing in userPoolID and userIdentityPoolId
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceIdentityPoolId,
    },
  },
});

const awsRegion = "ap-southeast-1";

export class AuthService {
  private user: string | undefined;
  private jwtToken: string | undefined;
  private temporaryCredentials: object | undefined;

  // 1.  Login Method
  public async login(
    username: string,
    password: string
  ): Promise<object | undefined> {
    try {
      // Sign in
      const result = (await signIn({
        username,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      })) as SignInOutput;
      // Get user details from session
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      const token = idToken?.toString();
      if (token !== "") {
        this.jwtToken = token as string;
        const credentials = await this.getTemporaryCredentials();
        console.log(credentials);
      }

      if (session.tokens?.signInDetails?.loginId) {
        this.user = session.tokens?.signInDetails?.loginId as string;
      }

      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // 2. Get temp Credentials - Lazy Loading pattern
  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    } else {
      this.temporaryCredentials = await this.generateTemporaryCredentials();
      return this.temporaryCredentials;
    }
  }

  // 3. Generate Temperary Credentials for S3 Bucket Photos
  private async generateTemporaryCredentials() {
    try {
      const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
      const cognitoIdentity = new CognitoIdentityClient({
        credentials: fromCognitoIdentityPool({
          clientConfig: {
            region: awsRegion,
          },
          identityPoolId: AuthStack.SpaceIdentityPoolId,
          logins: {
            [cognitoIdentityPool]: this.jwtToken as string,
          },
        }),
      });

      const credentials = await cognitoIdentity.config.credentials();
      return credentials;
    } catch (error) {
      console.log(`❌❌❌: `, error);
    }
  }

  // 4. Get Username Method
  public getUserName() {
    return this.user;
  }
}
