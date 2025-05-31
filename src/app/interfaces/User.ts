import userRoles from "../enums/userRoles";

export interface User {
  id: number;
  username: string;
  email: string;
  role: userRoles;
} 