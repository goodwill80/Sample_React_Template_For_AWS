import { SignInOutput, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const userPoolId = '';
const UserPoolClientId = '';
const identityPoolId = '';

// Initialise Amplify API to communicate with AWS cognito - by passing in userPoolID and userIdentityPoolId
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: UserPoolClientId,
      identityPoolId: identityPoolId,
    },
  },
});

export class AuthService {
  public async login(
    username: string,
    password: string
  ): Promise<object | undefined> {
    const result = (await signIn({
      username,
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH',
      },
    })) as SignInOutput;
    return result;
  }

  public getUserName() {
    return 'some user';
  }
}
