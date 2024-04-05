export class DataService {
  public async createSpace(name: string, location: string, photo?: File) {
    return {
      name,
      location,
      photo,
    };
  }

  public isAuthorized() {
    return true;
  }
}
