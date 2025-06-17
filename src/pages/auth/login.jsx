import React, { useState } from "react";
import { Form, Input, message as antdMessage } from "antd";
import AuthLayout from "../../components/auth-layout";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/primary.button";
import { ROUTES } from "../../config/route.const";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { useMutate } from "../../hooks/useQuery";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import LoadingButton from "../../components/common/loading-button";
import { QUERY_KEYS, QUERY_METHODS } from "../../config/query.const";
import { getValidationRule } from "../../utils/validation";
import { delay } from "../../utils/delay";

const Login = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);

  const { mutate: loginMutation } = useMutate(
    QUERY_KEYS.AUTH.LOGIN,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.LOGIN,
    {
      onSuccess: async (data) => {

        const userRole = data.data?.user?.role;
        if (userRole !== "admin" && userRole !== "owner") {
          console.log("inside if");
          messageApi.open({
            type: "error",
            content: "Access denied. Admins and owners only.",
            duration: 2,
          });
          setShowLoader(false);
          return;
        }
        messageApi.success("Login successful!");
        await delay(1000);
        setShowLoader(false);
        localStorage.setItem("token", data?.data?.token);
        dispatch(setUser(data?.data?.user));
        navigate(ROUTES.DASHBOARD.HOME);
      },
      onError: (error) => {
        setShowLoader(false);
        messageApi.open({
          type: "error",
          content:
            error?.response?.data?.message || "Login failed. Please try again.",
          duration: 2,
        });
      },
    }
  );

  const onFinish = (values) => {
    setShowLoader(true);
    loginMutation({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <>
      {contextHolder}
      <AuthLayout>
        <div className="w-full max-w-lg">
          {/* Title & Subtext */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#122751] mb-1">
              Login
            </h2>
            <p className="text-sm text-[#8D94A3]">
              Please enter your admin email and password to access the
              dashboard.
            </p>
          </div>

          {/* Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={getValidationRule("email", true)}
              className="form-item"
            >
              <Input
                placeholder="Enter your email"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              className="form-item"
              rules={getValidationRule("password", true)}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <div className="flex items-center justify-end mb-4 mt-[-6px]">
              <Link
                style={{ color: "#01B763", fontWeight: "500" }}
                to={ROUTES.ADMIN.FORGET_PASSWORD}
              >
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <PrimaryButton htmlType="submit">
                {showLoader ? (
                  <LoadingButton size="small" />
                ) : (
                  "Sign in to Admin Panel"
                )}
              </PrimaryButton>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <div className="text-center text-sm text-[#1B254B] mt-6">
            Want to register as an admin?{" "}
            <Link
              to={ROUTES.ADMIN.SIGNUP}
              className="text-[#01B763] font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
