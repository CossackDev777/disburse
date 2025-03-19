//TODO: Checked
export interface AuthModel {
  user: UserModel;
  access_token: string;
}

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  theme: string;
}
