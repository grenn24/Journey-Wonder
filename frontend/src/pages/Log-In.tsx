import {
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Flex,
	Form,
	Input,
	theme,
	Typography,
} from "antd";
import React from "react";
import "../styles/ant.css";
import { GoogleOutlined } from "@ant-design/icons";
import authService from "../services/auth";

const Login = () => {
	const {
		token: { colorBgContainer, colorBorder },
	} = theme.useToken();
	const [form] = Form.useForm();
	const { Text, Link } = Typography;
	const handleFormSubmit = (values: any) => {
		authService
			.login(values)
			.then(({data,headers}) => {
				sessionStorage.setItem("accessToken",headers["x-access-token"])
				form.resetFields();
			})
			.catch((err) => {
				const { body } = err;
				if (body?.status === "INVALID_EMAIL_PASSWORD") {
					form.setFields([
						{
							name: "email",
							errors: ["Invalid email or password"],
						},
						{
							name: "password",
							errors: ["Invalid email or password"],
						},
					]);
				} else {
					console.log(err);
				}

			});
	};
	return (
		<Flex
			justify="center"
			align="center"
			style={{ background: colorBgContainer, height: "100vh" }}
		>
			<Card style={{ width: 420, border: `1.5px solid ${colorBorder}` }}>
				<Form form={form} onFinish={handleFormSubmit} layout="vertical">
					<Form.Item
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Please enter your email",
							},
							{
								validator: (_, value) => {
									const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
									if (!regex.test(value)) {
										return Promise.reject(
											"Invalid email format"
										);
									}

									return Promise.resolve();
								},
								validateTrigger: "onSubmit",
							},
						]}
					>
						<Input
							autoComplete="email"
							style={{ borderRadius: 9 }}
						/>
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Please enter your password",
							},
						]}
					>
						<Input.Password
							autoComplete="password"
							style={{ borderRadius: 9 }}
						/>
					</Form.Item>
					<Form.Item label={null}>
						<Flex justify="space-between" align="center">
							<Form.Item
								valuePropName="checked"
								name="remember"
								noStyle
							>
								<Checkbox className="custom-checkbox">
									Remember Me
								</Checkbox>
							</Form.Item>

							<Link href="" target="_self">
								Forgot Password
							</Link>
						</Flex>
					</Form.Item>
					<Form.Item>
						<Button
							block
							type="primary"
							htmlType="submit"
							size="large"
						>
							Log In
						</Button>
					</Form.Item>
					<Form.Item style={{ textAlign: "center" }}>
						<Text>Don't have an account yet? </Text>
						<Link href="sign-up" target="_self">
							Create One
						</Link>
					</Form.Item>
				</Form>
				<Divider plain>or</Divider>
				<Button
					icon={<GoogleOutlined />}
					iconPosition="start"
					block
					size="large"
					color="default"
				>
					Log In with Google
				</Button>
			</Card>
		</Flex>
	);
};

export default Login;
