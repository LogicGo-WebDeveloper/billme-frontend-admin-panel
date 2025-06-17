import React from 'react';
import { Button } from 'antd';

const SecondryButton = ({ children, onClick, type = 'default', className = '', style = {}, htmlType = 'button' }) => {
  let buttonClass = 'h-10 px-4 rounded font-medium ';

  if (type === 'primary') {
    buttonClass += 'bg-[#122751] text-white ';  
  } else {
    buttonClass += 'text-[#122751] bg-white border border-[#DCDFEA] ';
  }

  return (
    <Button
      onClick={onClick}
      className={buttonClass + className}
      style={style}
      htmlType={htmlType}
      
    >
      {children}
    </Button>
  );
};

export default SecondryButton;
