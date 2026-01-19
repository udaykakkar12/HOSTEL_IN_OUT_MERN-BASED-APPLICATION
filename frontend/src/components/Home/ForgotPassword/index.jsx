import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import http from "../../../utils/http";


const { Item } = Form;

const ForgotPassword = () => {


    const navigate = useNavigate();
    const [forgotForm] = Form.useForm();

    const [rePasswordForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

   const onFinish = async (values) => {
    try {
        setLoading(true);

        const response = await http.post(
            "/api/user/forgot-password",
            values
        );

        toast.success(response.data.message || 
          "Please check your email to reset password");

    } catch (err) {
        toast.error(
            err.response
                ? err.response.data.message
                : err.message
        );
    } finally {
        setLoading(false);
    }
};



    const onChangePassword = async (values) => {
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
        <Homelayout>
            <div className="flex">
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img
                        src="/abes1.jpeg"
                        alt="abes"
                        className="w-4/5 object-contain"

                    />

                </div>
                <div>
                    <Card className="w-full max w-sm shadow-xl">
                        <h2 className="font-bold text-[] text-2xl text-center mb-6">
                            Forgot Password

                        </h2>

                        {
                            token ?
                                <Form
                                    name="login-form"
                                    layout="vertical"
                                    onFinish={onChangePassword}
                                    form={rePasswordForm}
                                >
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

                                    <Item
                                        name="pre-password"
                                        label="re enter password"
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
                                            className="!bg-[#FF735C] !text-white !font-bold"
                                            loading={loading}
                                        >
                                            Change Password

                                        </Button>
                                    </Item>

                                </Form>
                                :
                                <Form
                                    name="login-form"
                                    layout="vertical"
                                    onFinish={onFinish}
                                    form={forgotForm}
                                >
                                    <Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="enter email"
                                        />

                                    </Item>



                                    <Item>
                                        <Button
                                            type="text"
                                            htmlType="submit"
                                            block
                                            className="!bg-[] !text-white !font-bold"
                                            loading={loading}
                                        >
                                            Submit

                                        </Button>
                                    </Item>

                                </Form>





                        }




                        <div className="flex items-center justify-between">
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/"
                               className="!text-[#020617] !font-bold hover:!text-[#0f172a]"

                            >
                                Sign in
                            </Link>
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/signup"
                                className="!text-[#020617] !font-bold hover:!text-[#0f172a]"

                            >
                                Dont have an account
                            </Link>

                        </div>

                    </Card>
                </div>
            </div>
        </Homelayout>
    )

}
export default ForgotPassword;