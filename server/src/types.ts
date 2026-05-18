export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
