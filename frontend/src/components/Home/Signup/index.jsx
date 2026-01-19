import { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import { toast } from "react-toastify";
import http from "../../../utils/http";


const { Item } = Form;

const Signup = () => {
  const [signupForm] = Form.useForm();
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  const onFinish = async (values) => {
    try {
      setLoading(true);

      // ✅ ONLY EMAIL goes to send-mail
      const { data } = await http.post("/api/user/send-mail", {
        email: values.email,
      });

      setOtp(data.otp);          // testing only
      setFormData(values);       // save full form
      toast.success("OTP sent");

    } catch (error) {
      toast.error("Failed to send OTP");
      setOtp(null);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const onSignup = async (values) => {
    try {
      if (Number(values.otp) !== Number(otp)) {
        return toast.error("OTP not match");
      }

      setLoading(true);

      // ✅ SEND OTP + FULL DATA
      await http.post("/api/user/signup", {
        ...formData,
        otp: values.otp,
      });

      toast.success("Signup success");

      setOtp(null);
      setFormData(null);
      signupForm.resetFields();

    } catch (err) {
      toast.error(
        err.response ? err.response.data.message : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homelayout>
      <div className="flex">
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img
            src="/abes1.jpeg"
            alt="expense"
            className="w-4/5 object-contain"
          />
        </div>

        <div>
          <Card className="w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-[] text-2xl text-center mb-6">
              Register To Hostel Tracker
            </h2>

            {otp ? (
              /* ================= OTP FORM ================= */
              <Form layout="vertical" onFinish={onSignup}>
                <Item
                  name="otp"
                  label="OTP"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Item>

                <Button
                  loading={loading}
                  htmlType="submit"
                  block
                className="!bg-[#020617] !text-white !font-bold hover:!bg-[#0f172a]"

                >
                  Verify & Signup
                </Button>
              </Form>
            ) : (
              /* ================= SIGNUP FORM ================= */
              <Form
                layout="vertical"
                onFinish={onFinish}
                form={signupForm}
              >
                <Item
                  name="fullname"
                  label="Full Name"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Item>

                <Item
                  name="mobile"
                  label="Mobile"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<PhoneOutlined />} />
                </Item>

                <Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Item>

                <Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Item>

                <Button
                  loading={loading}
                  htmlType="submit"
                  block
                  className="!bg-[#020617] !text-white !font-bold hover:!bg-[#0f172a]"

                >
                  Send OTP
                </Button>
              </Form>
            )}

            <div className="flex justify-end mt-4">
              <Link
                to="/"
                className="!text-[#020617] font-bold underline hover:!text-[#0f172a]"
              >
                Already have an account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Homelayout>
  );
};

export default Signup;
