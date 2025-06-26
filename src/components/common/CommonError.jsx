import React from "react";
import { Result } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const CommonError = ({
  message = "Something went wrong. Please try again later.",
  status = 500,
}) => {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Result
        status="error"
        icon={
          <CloseCircleOutlined
            style={{
              color: "#ff4d4f",
              fontSize: 52,
            //   background: "rgba(255,77,79,0.08)",
              borderRadius: "50%",
              padding: 16,
              boxShadow: "0 2px 16px 0 rgba(255,77,79,0.10)",
            }}
          />
        }
        title={
          <span style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 28 }}>
            Error
          </span>
        }
        subTitle={
          <span style={{ color: "#8D94A3", fontSize: 18 }}>{message}</span>
        }
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
          padding: "40px 0",
          width: "100%",
          maxWidth: 480,
        }}
      />
    </div>
  );
};

export default CommonError;