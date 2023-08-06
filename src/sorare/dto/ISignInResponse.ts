export interface ISignInResponse {
  signIn: {
    currentUser: {
      jwtToken: {
        token: string;
        expiredAt: string;
      };
    };
    errors: {
      message: string;
    }[];
  };
}
