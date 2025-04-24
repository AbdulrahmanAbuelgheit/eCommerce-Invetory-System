// user.ts
interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string[];
  phone1?: string;
}

export class User {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public userType: string[];
  public phone1: string;

  constructor(user: UserData) {
    this.id = user.id;
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
    this.userType = user.userType || [];
    this.phone1 = user.phone1||'';
  }
}
