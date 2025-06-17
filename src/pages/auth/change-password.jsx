import React, { useState } from 'react';
import { Form, Input, message as antdMessage } from 'antd';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import AuthLayout from '../../components/auth-layout';
import PrimaryButton from '../../components/common/primary.button';
import LoadingButton from '../../components/common/loading-button';
import { ROUTE_PATH } from '../../config/api-routes.config';
import { ROUTES } from '../../config/route.const';
import { QUERY_KEYS, QUERY_METHODS } from '../../config/query.const';
import { useMutate } from '../../hooks/useQuery';
import { delay } from '../../utils/delay';
import { getValidationRule } from '../../utils/validation';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [showLoader, setShowLoader] = useState(false);
  const [messageApi, contextHolder] = antdMessage.useMessage();

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  // If someone lands here without the email (e.g., direct URL hit) kick them out:
  if (!email) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} replace />;
  }

  /* ------------------------------------------------------------------
     Mutation: change‑password
  ------------------------------------------------------------------ */
  const { mutate: changePasswordMutation, isLoading } = useMutate(
    QUERY_KEYS.AUTH.CHANGE_PASSWORD,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.CHANGE_PASSWORD,
    {
      onSuccess: async () => {
        messageApi.open({
          type: "success",
          content: "Password changed successfully",
          duration: 2,
        });
        await delay(1000);
        setShowLoader(false);
        navigate(ROUTES.ADMIN.LOGIN);  
      },
      onError: (error) => {
        setShowLoader(false);
        messageApi.error(
          error.response?.data?.message ||
            'Password change failed. Please try again.'
        );
      },
    }
  );

  /* ------------------------------------------------------------------
     Form submit handler
  ------------------------------------------------------------------ */
  const onFinish = (values) => {
    const payload = {
      email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    setShowLoader(true);
    changePasswordMutation(payload);
  };

  return (
    <>
      {contextHolder}

      <AuthLayout>
        <div className="w-full max-w-lg">
          {/* Title & Sub‑text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#122751] mb-1">
              Set New Password
            </h2>
            <p className="text-sm text-[#8D94A3]">
              Password must be at least 8 characters
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
              label="New Password"
              name="password"
              rules={getValidationRule('password', true)}
              className="form-item"
            >
              <Input.Password
                placeholder="Enter your new password"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={getValidationRule('confirmPassword', true , form)}
              className="form-item"
            >
              <Input.Password
                placeholder="Confirm your new password"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item>
              <PrimaryButton htmlType="submit">
                {showLoader ? (
                  <LoadingButton size="small" />
                ) : (
                  'Reset Password'
                )}
              </PrimaryButton>
            </Form.Item>
          </Form>
        </div>
      </AuthLayout>
    </>
  );
};

export default ChangePassword;
