export class AuthService {
  public async login(
    username: string,
    password: string
  ): Promise<object | undefined> {
    return {
      user: username,
      password: password,
    };
  }

  public getUserName() {
    return 'some user';
  }
}
