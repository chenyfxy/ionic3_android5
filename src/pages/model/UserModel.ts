export class UserModel {
  constructor(
    public id: number,
    public userName: string,
    public password: string,
    public nickName: string,
    public avatar: string
  ) {}
}
