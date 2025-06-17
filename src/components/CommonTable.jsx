import React from "react";
import { Table } from "antd";

const CommonTable = ({
  columns = [],
  dataSource = [],
  loading = false,
  pagination = true,
  rowKey = "id",
  scroll = {},
  ...rest
}) => {
  return (
    <div className="h-full overflow-hidden">
      <Table
        className="themed-table"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        rowKey={rowKey}
        scroll={scroll}
        bordered
        {...rest}
      />
    </div>
  );
};

export default CommonTable;
