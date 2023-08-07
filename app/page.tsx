'use client';
import { AuthCheck } from './Authenticated';
import Validator from './Validator'
import { useGlobalContext } from './contexts/store';
import { Button } from 'antd';

function Home() {
  const { userId, setUserId, data, setData } = useGlobalContext();
  
  localStorage.setItem('token', data.accessToken);

  return (
    <>
      <div>
        <h1>Home page</h1>
        <p>User: {data.email}</p>
        <p>credits: {data.credits}</p>
        {/* logout button */}
        <Button type="primary" onClick={() => {
          {/* clear local storage tokens */}
          localStorage.removeItem('token');
          setUserId('');
          setData({ email: '', credits: '', sub: '', accessToken: '' });
        }}>Logout</Button>
      </div>
      <Validator />
    </>
  )
}

export default AuthCheck(Home);