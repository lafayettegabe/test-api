'use server'
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID as string,
  }),
});

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

interface userAuth {
    IdToken: string | null;
    AccessToken: string | null;
    RefreshToken: string | null;
}

export const serverHandleLogin = async (values: any): Promise<userAuth> => {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_CLIENT_ID as string,
      AuthParameters: {
        USERNAME: values.email,
        PASSWORD: values.password,
      },
    };

    try {
      
      const data = await cognito.initiateAuth(params).promise();
      
      console.log('Logged in.');
      
      const idToken = data.AuthenticationResult?.IdToken;
      const accessToken = data.AuthenticationResult?.AccessToken;
      const refreshToken = data.AuthenticationResult?.RefreshToken;

      console.log('Got tokens.');
      
      return {
        IdToken: idToken as string,
        AccessToken: accessToken as string,
        RefreshToken: refreshToken as string,
        };
    } catch (error) {
      console.error('Login error:', error);
      return {
            IdToken: null,
            AccessToken: null,
            RefreshToken: null,
      }
    }
};

export const serverHandleLogout = async (): Promise<any> => {
  const params = {
    ClientId: process.env.AWS_CLIENT_ID as string,
    AccessToken: process.env.AWS_ACCESS_TOKEN as string,
  };

  try {
    await cognito.globalSignOut(params).promise();
    console.log('Logged out.');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export const serverHandleRegistration = async (values: any): Promise<any> => {
  
  const params = {
    ClientId: process.env.AWS_CLIENT_ID as string,
    Username: values.email,
    Password: values.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: values.email,
      },
      {
        Name: 'custom:credits',
        Value: '0',
      }
    ],
  };

  try {
    await cognito.signUp(params).promise();
    console.log('Registration successful');
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};


export const getUser = async (accessToken: string): Promise<any> => {

    try{
      const userParams = {
          AccessToken: accessToken as string,
      };

      const userData = await cognito.getUser(userParams).promise();
      console.log('Got user data.');

      return userData;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
};