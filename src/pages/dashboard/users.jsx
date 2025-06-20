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
import dayjs from "dayjs";
import PrimaryButton from "../../components/common/primary.button";
import CommonModal from "../../components/common/commonModal";
import { RxCross2 } from "react-icons/rx";

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const demoInvoices = [
    {
      invoiceNumber: "INV-001",
      invoiceStatus: "Paid",
      total: "$100",
      issueDate: "2024-12-01",
      dueDate: "2025-01-01",
    },
    {
      invoiceNumber: "INV-002",
      invoiceStatus: "Pending",
      total: "$250",
      issueDate: "2025-01-15",
      dueDate: "2025-02-15",
    },
    {
      invoiceNumber: "INV-003",
      invoiceStatus: "Overdue",
      total: "$180",
      issueDate: "2025-02-10",
      dueDate: "2025-03-10",
    },
    {
      invoiceNumber: "INV-004",
      invoiceStatus: "Paid",
      total: "$75",
      issueDate: "2025-02-28",
      dueDate: "2025-03-28",
    },
    {
      invoiceNumber: "INV-005",
      invoiceStatus: "Pending",
      total: "$300",
      issueDate: "2025-03-15",
      dueDate: "2025-04-15",
    },
    {
      invoiceNumber: "INV-006",
      invoiceStatus: "Paid",
      total: "$450",
      issueDate: "2025-04-01",
      dueDate: "2025-05-01",
    },
    {
      invoiceNumber: "INV-007",
      invoiceStatus: "Overdue",
      total: "$90",
      issueDate: "2025-04-20",
      dueDate: "2025-05-20",
    },
  ];

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

  const invoiceQuery = useFetch(
    [QUERY_KEYS.INVOICE.GET_INVOICES_BY_USER, selectedUser?._id],
    selectedUser?._id
      ? `${ROUTE_PATH.INVOICE.GET_INVOICES_BY_USER}?userId=${selectedUser._id}`
      : "",
    {
      enabled: !!selectedUser?._id,
    }
  );
  const { data: invoiceData, isLoading: invoiceLoading } =
    useQueryState(invoiceQuery);
  console.log("invoice data", invoiceData?.data);
  const userInvoices = invoiceData?.data || [];

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email) => email || "-",
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
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("DD MMM YYYY") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <>
          {/* <button
            onClick={() => handleViewUser(record)}
            className="text-[#1890ff] hover:underline"
          >
            View
          </button> */}

          <PrimaryButton
            type="primary"
            onClick={() => handleViewUser(record)}
            style={{ width: 80, height: 32, fontSize: "12px" }}
          >
            View
          </PrimaryButton>
        </>
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

  const handleViewUser = (user) => {
    console.log("View user:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
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
            <div className="flex justify-center items-center h-full p-5 bg-white">
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
                  pagination={false}
                  scroll={
                    users.length > 0
                      ? { x: 1000, y: "calc(100vh - 300px)" }
                      : {}
                  }
                />

                <div className="flex flex-col lg:flex-row sm:justify-between sm:items-center items-center px-2 py-1 bg-white text-center w-full">
                  {/* Total Users Text */}
                  {/* <div className="text-sm text-[#122751] font-medium text-center w-auto px-2 py-1.5 border border-[#d9d9d9] rounded mt-2  sm:mt-0 ">
                    Total Users: {totalUsers}
                  </div> */}

                  <div className="text-xs sm:text-sm text-[#122751] font-medium text-center sm:w-auto px-2 py-1 border border-[#d9d9d9] rounded mt-2 lg:mt-0">
                    Total Users: {totalUsers}
                  </div>

                  {/* Pagination for small screens (centered, no size changer) */}
                  <div className="w-full sm:hidden flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalUsers}
                      onChange={handlePaginationChange}
                      showSizeChanger={false}
                      responsive
                    />
                  </div>

                  {/* Pagination for larger screens (aligned right with size changer) */}
                  <div className="hidden sm:flex justify-end w-full sm:w-auto">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalUsers}
                      onChange={handlePaginationChange}
                      showSizeChanger={true}
                      responsive
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Content>

      <CommonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreviewUrl(null);
        }}
        title={null}
        width={previewUrl ? 1000 : 820} 
      >
        {/* If PDF is open, show iframe preview */}
        {previewUrl ? (
          <div className="flex flex-col h-[80vh]">
          {/* Modal Header (always present) */}
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h2 className="text-[#122751] text-lg font-semibold">Invoice Preview</h2>
            <RxCross2
              onClick={() => setPreviewUrl(null)}
              className="text-2xl text-[#122751]] hover:bg-[#f0f4ff] cursor-pointer"
            />
          </div>
      
          {/* Scrollable PDF viewer */}
          <div className="flex-1 overflow-hidden rounded-lg">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
              title="Invoice PDF"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
              {/* Total Invoices + Close */}
              <div className="flex justify-between items-center w-full sm:w-auto">
                <div className="text-[#122751] text-sm sm:text-base font-semibold">
                  Total Invoices: {userInvoices?.length}
                </div>
                <div className="sm:hidden">
                  <RxCross2
                    onClick={() => {
                      setIsModalOpen(false);
                      setPreviewUrl(null);
                    }}
                    className="text-xl cursor-pointer hover:bg-[#f0f4ff] text-[#122751] ml-2"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="w-full sm:w-[300px] order-2 sm:order-none">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined className="text-[#6b7280] mr-1" />}
                  className="w-full"
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  value={searchKeyword}
                />
              </div>

              {/* Desktop close */}
              <div className="hidden sm:block">
                <RxCross2
                  onClick={() => {
                    setIsModalOpen(false);
                    setPreviewUrl(null);
                  }}
                  className="text-2xl cursor-pointer hover:bg-[#f0f4ff] text-[#122751]"
                />
              </div>
            </div>

            {/* Invoice Cards */}
            <div className="max-h-[600px] overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
              {userInvoices
                .filter((invoice) =>
                  invoice.invoiceNumber
                    .toLowerCase()
                    .includes(searchKeyword?.toLowerCase() || "")
                )
                .map((invoice, idx) => (
                  <div
                    key={idx}
                    className="group relative border border-gray-200 rounded-lg sm:rounded-xl bg-gradient-to-tr from-white to-[#f9fbff] hover:from-[#f0f4ff] transition-all duration-300 shadow-sm hover:shadow-lg px-3 py-4 sm:px-5 sm:py-4"
                  >
                    <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <div className="text-[#122751] text-sm sm:text-base font-semibold tracking-wide">
                          #{invoice.invoiceNumber}
                        </div>
                        <div
                          className={`mt-1 sm:mt-0 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm w-max capitalize ${
                            invoice.invoiceStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.invoiceStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {invoice.invoiceStatus}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setPreviewUrl(invoice.templateUrl); // ✅ OPEN PREVIEW
                        }}
                        className="text-[12px] sm:text-sm font-medium hover:underline cursor-pointer text-[#122751] transition-colors duration-200"
                      >
                        View Invoice →
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-300 mb-3 sm:mb-4"></div>

                    {/* Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700">
                      <div>
                        <p className="text-gray-400 text-[11px] sm:text-xs mb-0.5 font-medium">
                          Issue Date
                        </p>
                        <p className="text-[#111827]">
                          {dayjs(invoice.issueDate).format("DD MMM YYYY")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[11px] sm:text-xs mb-0.5 font-medium">
                          Due Date
                        </p>
                        <p className="text-[#111827]">
                          {dayjs(invoice.dueDate).format("DD MMM YYYY")}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-gray-400 text-[11px] sm:text-xs mb-0.5 font-medium">
                          Total
                        </p>
                        <p className="text-sm sm:text-base font-bold text-[#122751]">
                          {invoice.total?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </CommonModal>
    </>
  );
};

export default Users;
