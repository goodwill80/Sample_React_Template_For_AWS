import { AuthService } from "./AuthService";

export class DataService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  // 1. Create Space Method
  public async createSpace(name: string, location: string, photo?: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    console.log(credentials);
    return { name, location, photo };
  }
  // 2. Check if the request is authorised
  public isAuthorized() {
    return true;
  }
}
