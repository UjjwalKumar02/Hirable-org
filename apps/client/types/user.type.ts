export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  accountType: string;
  userRole: string;
  creditBalance: number;
}
