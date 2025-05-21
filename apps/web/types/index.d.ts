export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

export type FormState =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type Session = {
  user: {
    id: number;
    name: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
};

export type SigninResponse = {
  id: number;
  name: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};
