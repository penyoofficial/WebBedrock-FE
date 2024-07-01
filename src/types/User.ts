export interface User {
  id?: number;
  loginName: string;
  password: string;
  userType: "ADMIN" | "O";
  name?: string;
}
