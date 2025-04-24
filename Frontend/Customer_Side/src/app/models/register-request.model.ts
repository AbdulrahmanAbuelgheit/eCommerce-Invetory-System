export class RegisterRequest {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone1: string,
    public password: string,
    public cart: any
  ) {}
}