export const SIGIN = `
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
