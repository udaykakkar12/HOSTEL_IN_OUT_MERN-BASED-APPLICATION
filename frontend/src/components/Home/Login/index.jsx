import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import http from "../../../utils/http";


const { Item } = Form;

const Login = () => {
    const navigate = useNavigate();
    const [loginForm] = Form.useForm();

    const [loading, setLoading] = useState(false);


    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { data } = await http.post("/api/user/login", values);
            const { role } = data;
            if (role === "admin")
                return toast.success("admin try to login");
            if (role === "user")
                return navigate("/app/user");

        } catch (error) {
            toast.error(err.response ? err.response.data.message : err.message);

        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="flex">
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img
                    src="/abes1.jpeg"
                    alt="expense"
                    className="w-4/5 object-contain"

                />

            </div>
            <div>
                <Card className="w-full max w-sm shadow-xl">
                    <h2 className="font-bold text-[] text-2xl text-center mb-6">
                        Track Your In-Out Record

                    </h2>

                    <Form
                        name="login-form"
                        layout="vertical"
                        onFinish={onFinish}
                        form={loginForm}
                    >
                        <Item
                            name="email"
                            label="Username"
                            rules={[{ required: true }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="enter your username"
                            />

                        </Item>

                        <Item
                            name="password"
                            label="password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="enter your password"
                            />

                        </Item>

                        <Item>
                            <Button
                                type="text"
                                htmlType="submit"
                                block
                                className="!bg-[#020617] !text-white !font-bold hover:!bg-[#0f172a]"

                                loading={loading}
                            >
                                Login

                            </Button>
                        </Item>

                    </Form>

                    <div className="flex items-center justify-between">
                        <Link
                            style={{ textDecoration: "underline" }}
                            to="/forgot-password"
                            className="!text-[#020617] font-bold underline hover:!text-[#0f172a]"
                        >
                            Forgot Password
                        </Link>
                        <Link
                            style={{ textDecoration: "underline" }}
                            to="/signup"
                            className="!text-[#020617] font-bold underline hover:!text-[#0f172a]"
                        >
                            Dont have an account
                        </Link>

                    </div>

                </Card>
            </div>
        </div>
    )

}
export default Login;