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
    id: string;
    name: string;
  };
  // accessToken: string;
  // refreshToken: string;
};
