'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Form, Input, Button } from 'antd';
import { 
  signUp, 
  signIn,
  keepLogin,
 } from '../auth';
import { useGlobalContext } from '../contexts/store';
import { useRouter } from 'next/navigation';

const { Content } = Layout;
const { TabPane } = Tabs;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const { userId, setUserId, data, setData } = useGlobalContext();
  const router = useRouter();

  const handleLogin = async (values: any) => {
    setLoading(true);

    try {
      let apidata = await signIn(values);

      for (const key in apidata) {
        const name = apidata[key].Name.replace("custom:", "");
        apidata[name] = apidata[key].Value;
        delete apidata[key];
    }
      console.log(apidata);

      setData(apidata);
      setUserId(apidata.sub);
      router.push('/');
    } catch (error : any) {
      if (error.message === 'User is not confirmed.') {
        setLoading(false);
        setData({
          email: values.email,
          credits: '',
          sub: '',
          accessToken: '',
        })
        router.push('/login/verify');
      }
      console.error('Login error:', error);
    } finally {
      // save token to local storage
      console.log(data);
      setLoading(false);
    }
  };

  const handleRegistration = async (values: any) => {
    setRegisterLoading(true);

    try {
      const data = await signUp(values)
      console.log(data);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    // If user is already logged in or have storage token, redirect to home page
    if(localStorage.getItem('token') !== null) {
      const token = localStorage.getItem('token');
      keepLogin(token)
        .then((data) => {
          for (const key in data) {
            const name = data[key].Name.replace("custom:", "");
            data[name] = data[key].Value;
            delete data[key];
          }
          console.log(data);
          setData(data);
          setUserId(data.sub);
          router.push('/');
        })
        .catch((error) => {
          console.error(error);
        }
      );
    }
  }, [userId, router, setData, setUserId]);


  return (
    <Layout className="layout">
      <Content style={{ padding: '50px' }}>
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="Login" key="login">
            <Form onFinish={handleLogin}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Log In
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Register" key="register">
            <Form onFinish={handleRegistration}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={registerLoading}>
                  Register
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default LoginPage;
