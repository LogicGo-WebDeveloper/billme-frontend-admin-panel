import React from 'react';
import { Skeleton } from 'antd';

/**
 * CommonSkeleton - Reusable Skeleton loader using Ant Design
 * 
 * @param {number} rows - Number of skeleton lines
 * @param {boolean} avatar - Whether to show an avatar placeholder
 * @param {boolean} active - Whether to animate the skeleton
 * @param {boolean} paragraph - Show paragraph lines (default: true)
 * @param {number} paragraphRows - Number of lines in paragraph (default: same as rows)
 */
const CommonSkeleton = ({
  rows = 3,
  avatar = false,
  active = true,
  paragraph = true,
  paragraphRows = null,
}) => {
  return (
    <Skeleton
      active={active}
      avatar={avatar}
      title={false}
      paragraph={paragraph ? { rows: paragraphRows || rows } : false}
    />
  );
};

export default CommonSkeleton;
