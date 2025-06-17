import React from 'react';
import { Button } from 'antd';

const PrimaryButton = ({ children, style = {} , className , ...props }) => {
  const baseStyle = {
    backgroundColor: '#01B763',
    color: '#fff',
    fontWeight: 600,
    borderRadius: '6px',
    width: '100%',
    height: '45px',
    fontSize: '16px',
    border: 'none',
    ...style,
  };

  return (
    <Button
      {...props}
      style={baseStyle}
      type="primary"
      className={className}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
