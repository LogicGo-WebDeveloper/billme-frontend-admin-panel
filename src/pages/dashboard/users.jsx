import React, { useState } from "react";
import { Input, Select, Pagination, Spin } from "antd";
import CommonTable from "../../components/CommonTable";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import { SearchOutlined } from "@ant-design/icons";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { useFetch, useQueryState } from "../../hooks/useQuery";
import { QUERY_KEYS } from "../../config/query.const";
import { Content } from "antd/es/layout/layout";
import CommonLoader from "../../components/common/CommonLoader";
import StatusBadge from "../../components/common/commonBadge";

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryURL = () => {
    const base = `${ROUTE_PATH.ADMINS_USERS.GET_USERS}?page=${currentPage}&limit=${pageSize}`;
    const search = searchText ? `&search=${searchText}` : "";
    const subFilter =
      subscriptionFilter === "subscribed"
        ? `&isSubscribe=true`
        : subscriptionFilter === "not_subscribed"
        ? `&isSubscribe=false`
        : "";

    return `${base}${search}${subFilter}`;
  };

  const query = useFetch(
    [
      QUERY_KEYS.ADMINS_USERS.GET_ALL_USERS,
      currentPage,
      pageSize,
      searchText,
      subscriptionFilter,
    ],
    buildQueryURL(),
    { refetchOnWindowFocus: false }
  );

  const { isLoading, isError, data, error } = useQueryState(query);

  const users = data?.data?.data || [];
  const totalUsers = data?.data?.totalItems || 0;

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name) => name || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email) => email || "-",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <span style={{  color: "#122751" }}>{role || "-"}</span>
      ),
    },
    {
      title: "Subscription",
      dataIndex: "isSubscribe",
      key: "isSubscribe",
      width: 160,
      render: (isSubscribe) => (
        <StatusBadge
          label={isSubscribe ? "Subscribed" : "Not Subscribed"}
          bgColor={isSubscribe ? "#d1fae5" : "#fee2e2"}
          textColor={isSubscribe ? "#047857" : "#b91c1c"}
        />
      ),
    },
  ];

  const handlePaginationChange = (page, newPageSize) => {
    console.log("page changed to", page, "size", newPageSize);
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setSubscriptionFilter(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex p-6 gap-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-[#6b7280] mr-1" />}
          className="w-full md:max-w-sm"
          onChange={handleSearchChange}
          value={searchText}
        />

        <Select
          value={subscriptionFilter}
          className="w-full md:w-[130px]"
          onChange={handleFilterChange}
          options={[
            { label: "All Users", value: "all" },
            { label: "Subscribed", value: "subscribed" },
            { label: "Not Subscribed", value: "not_subscribed" },
          ]}
        />
      </div>

      <Content className="mx-6 mb-6 mt-0 bg-white rounded-b-sm max-h-[calc(100vh-800px)]">
        <div className="">
          {/* Header */}

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full p-5">
              <CommonSkeleton rows={5} />
              {/* <CommonLoader  /> */}
            </div>
          ) : isError ? (
            <div className="text-red-500">
              Error: {error?.message || "Something went wrong."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <CommonTable
                  columns={columns}
                  dataSource={users}
                  rowKey="_id"
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalUsers,
                    onChange: handlePaginationChange,
                    showSizeChanger: true,
                    responsive: true,
                    // simple: window.innerWidth < 768,
                  }}
                  scroll={
                    users.length > 0
                      ? { x: 1000, y: "calc(100vh - 300px)" }
                      : {}
                  }
                />
              </div>
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default Users;
