'use client';

import React, { useState } from 'react';
import { Layout, Tabs, Form, Input, Button } from 'antd';
import { serverHandleLogin, serverHandleRegistration, getUser } from './Auth';
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

    interface userAuth {
      IdToken: string | null;
      AccessToken: string | null;
      RefreshToken: string | null;
    }

    try {
      const data : userAuth = await serverHandleLogin(values);

      //const idToken = data.IdToken;
      const accessToken = data.AccessToken;
      //const refreshToken = data.RefreshToken;

      const user = await getUser(accessToken || '');
      
      if (user) {
        setUserId(user.Username);
        setData({
          email: user.UserAttributes.find((attr: { Name: string; }) => attr.Name === "email").Value,
          credits: user.UserAttributes.find((attr: { Name: string; }) => attr.Name === "custom:credits").Value
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
      router.push('/');
    }
  };

  const handleRegistration = async (values: any) => {
    setRegisterLoading(true);

    try {
      const data = await serverHandleRegistration(values);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setRegisterLoading(false);
    }
  };

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
