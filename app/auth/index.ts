'use server'
import { SignUpCommand, CognitoIdentityProviderClient, AuthFlowType, InitiateAuthCommand, GetUserCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, AdminUpdateUserAttributesCommand, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "./util-aws-sdk";

// ------------------------------------------------------------------------------------------------------------
// Keep Login
const keepLogin = async (token: any) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const userCommand = new GetUserCommand({
    AccessToken: token as string,
  });

  const user = await client.send(userCommand);

  return { ...user.UserAttributes, 4: {Name: 'accessToken', Value: token} };
};

// ------------------------------------------------------------------------------------------------------------
// SignUp
const signUp = async (values: any) => {
  try {
    const client = createClientForDefaultRegion(CognitoIdentityProviderClient);
  
    console.log('Signing up...');
    console.log('values.email: ', values.email);

    const command = new SignUpCommand({
      ClientId: process.env.AWS_CLIENT_ID as string,
      Username: values.email as string,
      Password: values.password as string,
      UserAttributes: [
        { Name: "email", Value: values.email },
        { Name: "custom:credits", Value: "0" },
      ],
    });
  
    return client.send(command);
  } catch (error) {
    console.error('Registration error:', error);
    return error;
  }
  };

// ------------------------------------------------------------------------------------------------------------
// SignIn
const signIn = async (values: any) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.AWS_CLIENT_ID as string,
    AuthParameters: {
      USERNAME: values.email as string,
      PASSWORD: values.password as string,
    },
  });

  const data = await client.send(command);
  const tokens = data.AuthenticationResult;

  const userCommand = new GetUserCommand({
    AccessToken: tokens.AccessToken as string,
  });

  const user = await client.send(userCommand);

  return { ...user.UserAttributes, 4: {Name: 'accessToken', Value: tokens.AccessToken} };
};

// ------------------------------------------------------------------------------------------------------------
// confirmSignUp
const confirmSignUp = async (mail : string, code : string) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const command = new ConfirmSignUpCommand({
    ClientId: process.env.AWS_CLIENT_ID as string,
    Username: mail,
    ConfirmationCode: code
  });

  return client.send(command);
};

// ------------------------------------------------------------------------------------------------------------
// 
const resendConfirmationCode = async (mail : string) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const command = new ResendConfirmationCodeCommand({
    ClientId: process.env.AWS_CLIENT_ID as string,
    Username: mail
  });

  return client.send(command);
};

// ------------------------------------------------------------------------------------------------------------
// Bill - adminUpdateUserAttributes
const bill = async (token : string, newCredits : string) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  console.log('Data: ', token, newCredits);

  const command = new UpdateUserAttributesCommand({
    UserAttributes: [
      { Name: "custom:credits", Value: newCredits },
    ],
    AccessToken: token
  });

  console.log('Command: ', command);

  return client.send(command);
};

// ------------------------------------------------------------------------------------------------------------
export { signUp, signIn, confirmSignUp, resendConfirmationCode, bill, keepLogin };