// RegisterPage.jsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Register = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await axios.post('http://localhost:8083/api/v1/auth/register', {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        username: values.username,
        password: values.password,
      });

      message.success('Registration successful. You can now log in.');
      // clear all inputs
      
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.status === 409) {
        // HTTP status 409 indicates a conflict, which might mean duplicate email
        message.error('Email already exists. Please use a different email.');
      } else {
        message.error('Registration failed. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <Form
      name="register"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item label="First Name" name="firstname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
