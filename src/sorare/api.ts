import { GraphQLClient } from 'graphql-request';
import 'dotenv/config';
import Helper from '../utils/helper';
import { ISignInResponse } from './dto/ISignInResponse';

export default class SorareApi {
  private static instance: SorareApi | null = null;
  private constructor() {}
  public static getInstance(): SorareApi {
    if (!SorareApi.instance) {
      SorareApi.instance = new SorareApi();
    }
    return SorareApi.instance;
  }

  public Auth = async () => {
    const graphQLClient = new GraphQLClient(
      `${process.env.API_URL}/federation/graphql`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const mutation = `
     mutation SignInMutation($input: signInInput!) {
      signIn(input: $input) {
        currentUser {
          slug
          jwtToken(aud: "poc-sorare") {
            token
            expiredAt
          }
        }
        errors {
          message
        }
      }
    }
  `;

    let hashPassword: string = '';

    const salt = await Helper.getSalt();

    if (salt) {
      hashPassword = await Helper.hashPassword(
        process.env.PSWD_SORARE,
        salt.toString()
      );
    }

    const variables = {
      input: {
        email: process.env.EMAIL_SORARE,
        password: hashPassword,
      },
    };

    try {
      const data = await graphQLClient.request<ISignInResponse>(
        mutation,
        variables
      );
      if (data && data.signIn && data.signIn.currentUser) {
        const { token, expiredAt } = data.signIn.currentUser.jwtToken;
        process.env.JWT_TOKEN = token;
        process.env.JWT_TOKEN_EXPIRY = expiredAt;
      } else {
        const { errors } = data.signIn;
        throw new Error('Errore auth sorare' + errors);
      }
    } catch (error) {
      throw new Error('Errore auth sorare:' + error);
    }
  };
}
