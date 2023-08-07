'use client';
import React, { useState } from 'react';
import { Layout, Tabs, Form, Input, Button } from 'antd';
import { confirmSignUp, resendConfirmationCode } from '../../auth';
import { useRouter } from 'next/navigation';

const { Content } = Layout;
const { TabPane } = Tabs;

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const handleResendCode = async () => {
        try {
            const data = await resendConfirmationCode(email);
            console.log(data);
        } catch (error) {
            console.error('Resend code error:', error);
        }
    };

    const handleConfirmSignUp = async () => {
        try {
            const data = await confirmSignUp(email, code);
            console.log(data);
            router.push('/login');
        } catch (error) {
            console.error('Confirm sign-up error:', error);
        }
    };

    return (
        <Layout className="layout">
            <Content style={{ padding: '50px' }}>
                <Tabs defaultActiveKey="login" centered>
                    <TabPane tab="Verify" key="verify">
                        <Form>
                            <Form.Item name="email" label="Email">
                                <Input value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Item>
                            <Form.Item name="code" label="Confirmation Code">
                                <Input value={code} onChange={e => setCode(e.target.value)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleResendCode}>
                                    Resend Code
                                </Button>
                                <Button type="primary" onClick={handleConfirmSignUp}>
                                    Confirm Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Content>
        </Layout>
    );
};

export default VerifyPage;
