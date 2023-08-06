'use client';
import { useEffect } from 'react';
import { AuthCheck } from './Authenticated';
import Validator from './Validator'
import { useGlobalContext } from './contexts/store';
import { Button } from 'antd';

function Home() {
  const { userId, setUserId, data, setData } = useGlobalContext();

  return (
    <>
      <div>
        <h1>Home page</h1>
        <p>User: {data.email}</p>
        <p>credits: {data.credits}</p>
        {/* logout button */}
        <Button type="primary" onClick={() => {
          {/* clear local storage tokens */}
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('idToken');
          setUserId('');
          setData({ email: '', credits: '' });
        }}>Logout</Button>
      </div>
      <Validator />
    </>
  )
}

export default AuthCheck(Home);