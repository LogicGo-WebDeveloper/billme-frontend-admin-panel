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
          icon={<EyeOutlined />}
          onClick={() => {
            setPreviewUrl(record?.InvoiceUrl);
            setPreviewVisible(true);
          }}
          style={{ width: 100, height: 32, fontSize: "12px" }}
        >
          View
        </PrimaryButton>
      ),
    },
  ];

  const handlePaginationChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 p-6">
        {/* Search Input */}
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

        {/* Date Range Picker */}
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
              <CommonSkeleton rows={6} />
            </div>
          ) : isError ? (
            <div className="text-red-500">
              Error: {error?.message || "Something went wrong."}
            </div>
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
                      ? { x: 1000, y: "calc(100vh - 300px)" }
                      : {}
                  }
                />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-center px-2 py-1 bg-white text-center w-full">
                  {/* Total Invoices Text */}
                  <div className="text-sm text-[#122751] font-medium text-center w-auto px-2 py-1.5 border border-[#d9d9d9] rounded mt-2 sm:mt-0">
                    Total Invoices: {totalInvoices}
                  </div>

                  {/* Pagination */}
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalInvoices}
                      onChange={handlePaginationChange}
                      showSizeChanger
                      responsive
                      className="flex justify-center sm:justify-end"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Content>

      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={900}
      >
        <iframe
          src={previewUrl}
          title="Invoice Preview"
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      </Modal>
    </>
  );
};

export default Invoices;
