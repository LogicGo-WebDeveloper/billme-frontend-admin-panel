import React, { useState } from "react";
import { Input, Select, Pagination } from "antd";
import CommonTable from "../../components/CommonTable";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import { SearchOutlined } from "@ant-design/icons";
import { useFetch, useQueryState } from "../../hooks/useQuery";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { QUERY_KEYS } from "../../config/query.const";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import CommonError from "../../components/common/CommonError";

const Admins = () => {
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryURL = () => {
    const base = `${ROUTE_PATH.ADMINS_USERS.GET_ADMINS}?page=${currentPage}&limit=${pageSize}`;
    const search = searchText ? `&search=${searchText}` : "";
    return `${base}${search}`;
  };

  const query = useFetch(
    [QUERY_KEYS.ADMINS_USERS.GET_ALL_ADMIN, currentPage, pageSize, searchText],
    buildQueryURL(),
    { refetchOnWindowFocus: false }
  );

  const { isLoading, isError, data, error } = useQueryState(query);

  const admins = data?.data?.data || [];
  const totalAdmins = data?.data?.totalItems || 0;

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   key: "name",
    //   width: 200,
    //   render: (name) => name || "-",
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email) => email || "-",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("DD MMM YYYY") : "-",
    },
  ];

  return (
    <>
      {/* Search & Filter */}
      <div className="p-6">
        {/* Mobile Layout: Search + Per Page */}
        <div className="flex gap-3 sm:hidden">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-[#6b7280] mr-1" />}
            className="w-full"
            onChange={handleSearchChange}
            value={searchText}
          />

          <Select
            value={pageSize}
            onChange={(val) => {
              setPageSize(val);
              setCurrentPage(1);
            }}
            options={[
              { label: "10 / page", value: 10 },
              { label: "20 / page", value: 20 },
              { label: "50 / page", value: 50 },
              { label: "100 / page", value: 100 },
            ]}
            className="w-[120px]"
            dropdownMatchSelectWidth={false}
          />
        </div>

        {/* Desktop Layout: Search only */}
        <div className="hidden sm:flex gap-4 mt-3 sm:mt-0">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-[#6b7280] mr-1" />}
            className="w-full md:max-w-sm"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>
      </div>

      {/* Table Content */}
      <Content className="mx-6 mb-6 mt-0 bg-white rounded-b-sm max-h-[calc(100vh-800px)]">
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full p-5 bg-white">
              <CommonSkeleton rows={5} />
            </div>
          ) : isError ? (
            <CommonError
              message={
                error?.response?.data?.message ||
                (error?.response?.status === 500
                  ? "Something went wrong. Please try again later."
                  : error?.message || "An error occurred.")
              }
              status={error?.response?.status}
            />
          ) : (
            <>
              <>
                <CommonTable
                  columns={columns}
                  dataSource={admins}
                  rowKey="_id"
                  pagination={false}
                  scroll={
                    admins.length > 0
                      ? { x: 1000, y: "calc(90vh - 300px)" }
                      : {}
                  }
                />
                
                <div className="flex flex-col md:flex-row sm:justify-between sm:items-center items-center px-2 py-1 bg-white text-center w-full">
                  {/* Total Admins */}
                  <div className="text-xs sm:text-sm text-[#122751] font-medium text-center sm:w-auto px-2 py-1 border border-[#d9d9d9] rounded mt-2 lg:mt-0">
                    Total Admins: {totalAdmins}
                  </div>

                  {/* Pagination for small screens */}
                  <div className="w-full sm:hidden flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalAdmins}
                      onChange={handlePaginationChange}
                      showSizeChanger={false}
                      responsive
                    />
                  </div>

                  {/* Pagination for larger screens */}
                  <div className="hidden sm:flex justify-end w-full sm:w-auto">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalAdmins}
                      onChange={handlePaginationChange}
                      showSizeChanger={true}
                      responsive
                    />
                  </div>
                </div>
              </>
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default Admins;
