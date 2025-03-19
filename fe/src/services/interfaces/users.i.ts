export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IUpdateUser {
  name?: string;
  // email?: string;
  password?: string;
}

export interface IUpdateTheme {
  theme: string;
}
