import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import { AuthStack } from "../../../AWS_CDK_STARTER_API/outputs.json";

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

export class AuthService {
  private user: string | undefined;
  public async login(
    username: string,
    password: string
  ): Promise<object | undefined> {
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

    if (session.tokens?.signInDetails?.loginId) {
      this.user = session.tokens?.signInDetails?.loginId as string;
    }
    return result;
  }

  public getUserName() {
    return this.user;
  }
}
