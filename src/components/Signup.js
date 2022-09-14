import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDetails } from "../store/user";
import "./SignUp.css";

export function Signup() {
  const navigate = useNavigate();

  const [userData, setuserData] = useDetails();
  const [name, setName] = useState(userData.displayName);
  const [email, setEmail] = useState(userData.email);
  const [profile, setProfile] = useState(userData.image);
  const [form] = Form.useForm();
  console.log(userData);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleProfile = (e) => {
    setProfile(e.target.value);
  };

  const submitForm = (values) => {
    mutation.mutate(
      {
        user_name: values.user_name,
        name: values.name,
        email: values.email,
        image: values.profile,
        bio: values.about,
      },
      {
        onSuccess: async () => {
          navigate("/Home");
        },
      }
    );
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const mutation = useMutation((data) => {
    return axios.post("http://localhost:3001/api/v1/users", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  return (
    <div className="signup-form">
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 10,
        }}
        initialValues={{
          remember: true,
          name: name,
          email: email,
          profile: profile,
        }}
        onFinish={submitForm}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input onChange={handleName} value={name} />
        </Form.Item>

        <Form.Item
          label="user_name"
          name="user_name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input placeholder="must be unique" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please type a valid email !",
            },
          ]}
        >
          <Input disabled={true} value={email} />
        </Form.Item>

        <Form.Item
          label="About"
          name="about"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Profile Picture"
          name="profile"
          rules={[
            {
              message: "Please provide image address!",
            },
          ]}
        >
          <Input onChange={handleProfile} value={profile} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
