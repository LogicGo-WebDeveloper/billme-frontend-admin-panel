import React from "react";

const StatusBadge = ({ label = "-", bgColor = "#E5E7EB", textColor = "#374151" }) => {
  const style = {
    padding: "4px 14px",
    borderRadius: "9999px",
    fontWeight: 600,
    fontSize: "12px",
    display: "inline-block",
    minWidth: "100px",
    textAlign: "center",
    backgroundColor: bgColor,
    color: textColor,
  };

  return <span style={style}>{label}</span>;
};

export default StatusBadge;
