import React from 'react';
import { Modal } from 'antd';

const CommonModal = ({
  isOpen,
  onClose,
  title = '',
  children,
  footer = null,
  width = 520,
  centered = true,
  closable = false,
  maskClosable = true,
  destroyOnClose = true,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={title}
      footer={footer}
      width={width}
      centered={centered}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnHidden={destroyOnClose}
    >
      {children}
    </Modal>
  );
};

export default CommonModal;
