import React, { useState } from "react";
import { Form, Input, message as antdMessage } from "antd";
import AuthLayout from "../../components/auth-layout";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/common/primary.button";
import { ROUTES } from "../../config/route.const";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { QUERY_KEYS, QUERY_METHODS } from "../../config/query.const";
import { useMutate } from "../../hooks/useQuery";
import { delay } from "../../utils/delay";
import LoadingButton from "../../components/common/loading-button";
import { getValidationRule } from "../../utils/validation";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const [showLoader, setShowLoader] = useState(false);

  const { mutate: adminSignupMutation, isPending } = useMutate(
    QUERY_KEYS.AUTH.SIGNUP,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.SIGNUP,
    {
      onSuccess: async (data) => {
        messageApi.success("Signup request submitted successfully.");
        await delay(1000);
        setShowLoader(false);
        navigate(ROUTES.ADMIN.VERIFY_OTP, {
          state: {
            email: form.getFieldValue("email"),
            from: "signup",
          },
        });
      },
      onError: (error) => {
        console.log("Error:", error);
        setShowLoader(false);
        messageApi.error(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      },
    }
  );

  const onFinish = (values) => {
    console.log("Form values:", values);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: "admin",
    };

    setShowLoader(true);
    adminSignupMutation(payload);
  };

  return (
    <>
      {contextHolder}
      <AuthLayout>
        <div className="w-full max-w-lg">
          {/* Title & Subtext */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#122751] mb-2">
              Registration
            </h2>
            <p className="text-sm text-[#8D94A3]">
              Fill out the form below to request access as an admin. Your
              request will be reviewed by the Super Admin.
            </p>
          </div>

          {/* Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
            validateTrigger={["onChange", "onBlur"]}
          >
            <Form.Item
              label="Full Name"
              name="name"
              className="form-item"
              rules={getValidationRule("name")}
            >
              <Input
                placeholder="Enter your full name"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item
              label="Admin Email"
              name="email"
              className="form-item"
              rules={getValidationRule("email")}
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
              rules={getValidationRule("password")}
            >
              <Input.Password
                placeholder="Create a password"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item>
              <PrimaryButton
                htmlType="submit"
                disabled={isPending || showLoader}
              >
                {showLoader ? (
                  <LoadingButton size="small" />
                ) : (
                  "Request Admin Access"
                )}
              </PrimaryButton>
            </Form.Item>
          </Form>

          {/* Already have an account */}
          <div className="text-center text-sm text-[#1B254B]">
            Already registered?{" "}
            <Link
              to={ROUTES.ADMIN.LOGIN}
              className="text-[#01B763] font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Signup;
