const aws = {
    aws_project_region: process.env.AWS_REGION,
    aws_cognito_identity_pool_id: process.env.AWS_IDENTITY_POOL_ID, 
    aws_cognito_region: process.env.AWS_REGION,
    aws_user_pools_id: process.env.AWS_USER_POOL_ID, 
    aws_user_pools_web_client_id: process.env.AWS_USER_POOL_WEB_CLIENT_ID,
  };
  
  export default aws;