import React, { useState } from 'react';
import { Form, Input, message as antdMessage } from 'antd';
import AuthLayout from '../../components/auth-layout';
import PrimaryButton from '../../components/common/primary.button';
import LoadingButton from '../../components/common/loading-button';
import Loader from '../../components/common/CommonLoader';
import { getValidationRule } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/route.const';
import { ROUTE_PATH } from '../../config/api-routes.config';
import { useMutate } from '../../hooks/useQuery';
import { delay } from '../../utils/delay';
import { QUERY_KEYS, QUERY_METHODS } from '../../config/query.const';

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  // Reset password mutation
  const { mutate: resetPasswordMutation, isLoading } = useMutate(
    QUERY_KEYS.AUTH.FORGOT_PASSWORD,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.FORGOT_PASSWORD,
    {
      onSuccess: async () => {
        messageApi.success('Password reset otp sent successfully!');
        await delay(1000);
        setShowLoader(false);
        navigate(ROUTES.ADMIN.VERIFY_OTP, {
          state: {
            email: form.getFieldValue('email'),
            from: 'forgot-password',
          },
        });
      },
      onError: (error) => {
        console.log("error", error);
        setShowLoader(false);
        messageApi.open({
          type: 'error',
          content: error.response?.data?.message || 'Password reset failed. Please try again.',
          duration: 2,
        });
      },
    }
  );

  const onFinish = (values) => {
    setShowLoader(true);
    resetPasswordMutation({ email: values.email });
  };

  return (
    <>
      {contextHolder}
      <AuthLayout>
        <div className="w-full max-w-lg">
          {/* Title & Subtext */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#122751] mb-1">
              Forgot Your Password?
            </h2>
            <p className="text-sm text-[#8D94A3]">
              Don’t worry, happens to all of us. Enter your email below to recover your password.
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
              rules={getValidationRule('email', true)}
            >
              <Input
                placeholder="Enter your email"
                size="large"
                className="custom-placeholder"
              />
            </Form.Item>

            <Form.Item>
              <PrimaryButton htmlType="submit">
                {showLoader ? <LoadingButton size="small" /> : 'Reset Password'}
              </PrimaryButton>
            </Form.Item>
          </Form>
        </div>
      </AuthLayout>
      {isLoading && <Loader />}
    </>
  );
};

export default ForgetPassword;
