import React, { useState } from "react";
import { Typography, Pagination, Input, Select, DatePicker, Modal } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import CommonTable from "../../components/CommonTable";
import StatusBadge from "../../components/common/commonBadge";
import PrimaryButton from "../../components/common/primary.button";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import { useFetch, useQueryState } from "../../hooks/useQuery";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { QUERY_KEYS } from "../../config/query.const";
import dayjs from "dayjs";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/route.const";
import CommonError from "../../components/common/CommonError";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const Invoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const buildQueryURL = () => {
    let url = `${ROUTE_PATH.INVOICE.GET_ALL_INVOICES}?page=${currentPage}&limit=${pageSize}`;

    if (subscriptionFilter !== "all") {
      url += `&isSubscriptionUser=${subscriptionFilter}`;
    }
    if (invoiceStatusFilter !== "all") {
      url += `&invoiceStatus=${invoiceStatusFilter}`;
    }
    if (dateRange && dateRange.length === 2) {
      url += `&startDate=${dateRange[0].format("YYYY-MM-DD")}`;
      url += `&endDate=${dateRange[1].format("YYYY-MM-DD")}`;
    }

    if (searchText?.trim()) {
      url += `&search=${searchText.trim()}`;
    }

    return url;
  };

  const query = useFetch(
    [
      QUERY_KEYS.INVOICE.GET_ALL_INVOICES,
      currentPage,
      pageSize,
      subscriptionFilter,
      invoiceStatusFilter,
      dateRange,
      searchText,
    ],
    buildQueryURL(),
    { refetchOnWindowFocus: false }
  );

  const { isLoading, isError, data, error } = useQueryState(query);

  const invoices = data?.data || [];
  const totalInvoices = data?.pagination?.totalItems || 0;

  const invoiceTableColumns = [
    {
      title: "No.",
      key: "serialNumber",
      width: 70,
      align: "center",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 200,
      render: (text) => text || " - ",
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: 160,
      render: (status) => {
        const statusMap = {
          Draft: { bgColor: "#E0E7FF", textColor: "#3730A3" },
          Unpaid: { bgColor: "#FEE2E2", textColor: "#B91C1C" },
          Paid: { bgColor: "#d1fae5", textColor: "#047857" },
          Cancel: { bgColor: "#F3F4F6", textColor: "#6B7280" },
          OverDue: { bgColor: "#FEF3C7", textColor: "#92400E" },
        };
        const { bgColor, textColor } = statusMap[status] || {
          bgColor: "#E5E7EB",
          textColor: "#374151",
        };

        return (
          <StatusBadge label={status} bgColor={bgColor} textColor={textColor} />
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <PrimaryButton
          type="primary"
          // icon={<EyeOutlined />}
          onClick={() => {
            setPreviewUrl(record?.InvoiceUrl);
            navigate(
              `${ROUTES.DASHBOARD.INVOICE_PREVIEW}?url=${encodeURIComponent(
                record.InvoiceUrl ? record.InvoiceUrl : record?.templateUrl
              )}`
            );
          }}
          style={{ width: 80, height: 32, fontSize: "12px" }}
        >
          View
        </PrimaryButton>
      ),
    },
  ];

  // Handle pagination change
  const handlePaginationChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 md:flex-row md:flex-wrap">
        {/* Search Input - Full width on mobile, max width on desktop */}
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-[#6b7280] mr-1" />}
          className="w-full md:max-w-sm"
          onChange={handleSearchChange}
          value={searchText}
        />

        {/* Group: Subscription + Invoice Status (side by side on mobile) */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Subscription Filter */}
          <Select
            placeholder="Subscription"
            className="w-full md:w-[160px]"
            onChange={(value) => {
              setSubscriptionFilter(value);
              setCurrentPage(1);
            }}
            options={[
              { label: "All Users", value: "all" },
              { label: "Subscribed", value: "true" },
              { label: "Not Subscribed", value: "false" },
            ]}
            value={subscriptionFilter}
          />

          {/* Invoice Status Filter */}
          <Select
            placeholder="Invoice Status"
            className="w-full md:w-[160px]"
            onChange={(value) => {
              setInvoiceStatusFilter(value);
              setCurrentPage(1);
            }}
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Paid", value: "Paid" },
              { label: "Unpaid", value: "Unpaid" },
              { label: "Draft", value: "Draft" },
              { label: "OverDue", value: "OverDue" },
              { label: "Cancelled", value: "Cancel" },
            ]}
            value={invoiceStatusFilter}
          />
        </div>

        {/* Date Range Picker - full width on mobile */}
        <RangePicker
          className="w-full md:w-[250px]"
          onChange={handleDateRangeChange}
          value={dateRange}
        />
      </div>

      <Content className="mx-6 mb-6 bg-white rounded-b-sm max-h-[calc(100vh-800px)]">
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center h-full p-5 bg-white">
              <CommonSkeleton rows={8} />
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
              <div className="overflow-x-auto">
                <CommonTable
                  dataSource={invoices}
                  columns={invoiceTableColumns}
                  rowKey="_id"
                  pagination={false}
                  scroll={
                    invoices.length > 0
                      ? { x: 1000, y: "calc(90vh - 300px)" }
                      : {}
                  }
                />

                <div className="flex flex-col lg:flex-row sm:justify-between sm:items-center items-center px-2 py-1 bg-white text-center w-full">
                  {/* Total Invoices Text */}
                  <div className="text-xs sm:text-sm text-[#122751] font-medium text-center sm:w-auto px-2 py-1 border border-[#d9d9d9] rounded mt-2 lg:mt-0">
                    Total Invoices: {totalInvoices}
                  </div>

                  {/* Pagination */}
                  <div className="w-full sm:hidden flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalInvoices}
                      onChange={handlePaginationChange}
                      showSizeChanger={false}
                      responsive
                    />
                  </div>

                  <div className="hidden sm:flex justify-end w-full sm:w-auto">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalInvoices}
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
    </>
  );
};

export default Invoices;
