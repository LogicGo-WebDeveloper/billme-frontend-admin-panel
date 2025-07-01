import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Select,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CommonTable from "../../components/CommonTable";
import PrimaryButton from "../../components/common/primary.button";
import StatusBadge from "../../components/common/commonBadge";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/route.const";
import { useFetch, useQueryState } from "../../hooks/useQuery";
import { QUERY_KEYS } from "../../config/query.const";
import { ROUTE_PATH } from "../../config/api-routes.config";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import CommonLoader from "../../components/common/CommonLoader";
import dayjs from "dayjs";
import { MdAttachMoney } from "react-icons/md";
import CommonModal from "../../components/common/commonModal";
import { RxCross2 } from "react-icons/rx";
import CommonError from "../../components/common/CommonError";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { Option } = Select;
  const [userTimeType, setUserTimeType] = useState("monthly");
  const [invoiceDuration, setInvoiceDuration] = useState("monthly");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const navigate = useNavigate();

  const buildDashboardQueryURL = () => {
    const base = `${ROUTE_PATH.DASHBOARD.GET_DASHBOARD}`;
    const params = new URLSearchParams();

    if (userTimeType) params.append("userFilter", userTimeType);
    if (invoiceDuration) params.append("invoiceFilter", invoiceDuration);

    return `${base}?${params.toString()}`;
  };

  const query = useFetch(
    [QUERY_KEYS.DASHBOARD.GET_DASHBOARD, userTimeType, invoiceDuration],
    buildDashboardQueryURL(),
    { refetchOnWindowFocus: false }
  );

  const { isLoading, isError, data, error } = useQueryState(query);
  const dashboardData = data?.data;

  const transformChartData = (input) => {
    if (!input || !Array.isArray(input)) return [];
    return input.map((item) => item?.value || 0);
  };

  const transformChartLabels = (input) => {
    if (!input || !Array.isArray(input)) return [];
    return input.map((item) => item?.key || "");
  };

  const userChartRaw = dashboardData?.userChart || {};

  const userChart = {
    labels: transformChartLabels(userChartRaw?.totalUsers?.chart),
    all: transformChartData(userChartRaw?.totalUsers?.chart),
    subscribed: transformChartData(userChartRaw?.subscribeUsers?.chart),
    notSubscribed: transformChartData(userChartRaw?.unsubscribedUsers?.chart),
  };

  const invoiceChartRaw = dashboardData?.invoiceChart || {};

  const invoiceChart = {
    labels: transformChartLabels(invoiceChartRaw?.Paid?.chart),
    paid: transformChartData(invoiceChartRaw?.Paid?.chart),
    unpaid: transformChartData(invoiceChartRaw?.Unpaid?.chart),
    overdue: transformChartData(invoiceChartRaw?.OverDue?.chart),
  };

  const invoiceChartData = {
    labels: invoiceChart.labels,
    datasets: [
      {
        label: `Paid (${dashboardData?.invoiceChart?.Paid?.total || 0})`,
        data: invoiceChart.paid,
        borderColor: "#01B763",
        backgroundColor: "rgba(1, 183, 99, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: `Unpaid (${dashboardData?.invoiceChart?.Unpaid?.total || 0})`,
        data: invoiceChart.unpaid,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: `OverDue (${dashboardData?.invoiceChart?.OverDue?.total || 0})`,
        data: invoiceChart.overdue,
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.1)",
        Paidension: 0.4,
        fill: false,
      },
    ],
  };

  const buildRecentInvoicesURL = () =>
    `${ROUTE_PATH.INVOICE.GET_ALL_INVOICES}?limit=10&page=1&sortBy=createdAt:desc`;

  const recentInvoicesQuery = useFetch(
    [QUERY_KEYS.INVOICE.RECENT_INVOICES],
    buildRecentInvoicesURL(),
    { refetchOnWindowFocus: false }
  );

  const {
    data: recentInvoicesData,
    isLoading: recentInvoicesLoading,
    isError: recentInvoicesError,
  } = useQueryState(recentInvoicesQuery);
  const invoices = recentInvoicesData?.data || [];

  if (isLoading) {
    return <CommonLoader />;
  }

  const chartData = {
    labels: userChart.labels,
    datasets: [
      {
        label: `All Users (${
          dashboardData?.userChart?.totalUsers?.total || 0
        })`,
        data: userChart.all,
        borderColor: "#01B763",
        backgroundColor: "rgba(1, 183, 99, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: `Subscribed Users (${
          dashboardData?.userChart?.subscribeUsers?.total || 0
        })`,
        data: userChart.subscribed,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: `Not Subscribed Users (${
          dashboardData?.userChart?.unsubscribedUsers?.total || 0
        })`,
        data: userChart.notSubscribed,
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    aspectRatio: 2,
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const ticket = dashboardData?.ticket || {};

            if (label === "Open") {
              return [
                `Open: ${ticket.open}`,
                `Total: ${ticket.totalOpenTickets}`,
              ];
            } else if (label === "Close") {
              return [
                `Close: ${ticket.close}`,
                `Total: ${ticket.totalCloseTickets}`,
              ];
            }

            return [`${label}: ${context.raw}`];
          },
        },
      },
    },
  };

  const handlePreview = (url) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
    setIsPdfLoading(true);
  };

  // Table columns configuration
  const invoiceTableColumns = [
    {
      title: "No.",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
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
          onClick={() => handlePreview(record?.templateUrl)}
          style={{ width: 100, height: 32, fontSize: "12px" }}
        >
          View
        </PrimaryButton>
      ),
    },
  ];

  const cards = [
    {
      title: "Total Customers",
      value: dashboardData?.userSummary?.totalUsers || 0,
      icon: <UserOutlined className="text-xl" />,
      bgColor: "#DBEAFE",
      iconColor: "#1D4ED8",
    },
    {
      title: "Total Invoices",
      value: dashboardData?.totalInvoices || 0,
      icon: <FileTextOutlined className="text-xl" />,
      bgColor: "#D1FAE5",
      iconColor: "#059669",
    },
    {
      title: "Subscribed Customers",
      value: dashboardData?.userSummary?.subscribeUsers || 0,
      icon: <MdAttachMoney className="text-2xl" />,
      bgColor: "#EDE9FE",
      iconColor: "#7C3AED",
    },
    {
      title: "Not Subscribed Customers",
      value: dashboardData?.userSummary?.unsubscribedUsers || 0,
      icon: <UserOutlined className="text-xl" />,
      bgColor: "#FEF3C7",
      iconColor: "#F59E0B",
    },
  ];

  return (
    <>
      <div
        style={{
          padding: 24,
          Height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Row gutter={[16, 16]} style={{ flex: 1 }}>
          {cards.map((item, idx) => (
            <Col xs={24} lg={12} xl={6} key={idx}>
              <Card className="rounded-2xl shadow-md border border-gray-100 h-full">
                <div className="flex items-center h-[90px] gap-4">
                  <div
                    className="p-3 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.iconColor,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center flex-1 overflow-hidden">
                    <div className="text-gray-500 text-sm sm:text-xs md:text-sm lg:text-base leading-snug break-words max-w-full">
                      {item.title}
                    </div>
                    <div className="text-base sm:text-sm md:text-lg lg:text-xl font-semibold text-gray-800">
                      {item.value}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}

          <Col span={24} lg={16}>
            <Card
              title={
                <div className="flex flex-wrap items-center justify-between gap-1 w-full py-2">
                  <span className="text-[#122751] text-sm md:text-base font-semibold">
                    Users Overview
                  </span>

                  <div className="w-full sm:w-auto">
                    <Select
                      defaultValue={userTimeType}
                      onChange={(val) => setUserTimeType(val)}
                      className="w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 text-sm md:text-base"
                    >
                      <Option value="yearly">Yearly</Option>
                      <Option value="monthly">Monthly</Option>
                      <Option value="weekly">Weekly</Option>
                      <Option value="today">Today</Option>
                    </Select>
                  </div>
                </div>
              }
            >
              <div style={{ height: 300 }}>
                {/* <Line data={userChartData} options={chartOptions} /> */}
                {chartData?.labels?.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
              {/* <Line data={userChartData} options={chartOptions} /> */}
            </Card>
          </Col>

          {/* invoice status Doughnut chart */}
          <Col span={24} lg={8}>
            <Card
              title={
                <div className="flex flex-col xl:flex-row xl:items-center sm:justify-between gap-1 w-full py-2  ">
                  <span className="text-[#122751] text-sm md:text-base font-semibold">
                    Tickets Status
                  </span>

                  <div className="text-sm text-[#122751] font-medium border border-[#d9d9d9] rounded px-2 py-1 w-fit">
                    Total Tickets:{" "}
                    {parseFloat(dashboardData?.ticket?.totalOpenTickets || 0) +
                      parseFloat(dashboardData?.ticket?.totalCloseTickets || 0)}
                  </div>
                </div>
              }
            >
              <div style={{ height: 300 }}>
                <Doughnut
                  data={{
                    labels: ["Open", "Close"],
                    datasets: [
                      {
                        data: dashboardData?.ticket
                          ? [
                              parseFloat(dashboardData?.ticket?.open || 0),
                              parseFloat(dashboardData?.ticket?.close || 0),
                            ]
                          : [0, 0, 0],
                        backgroundColor: ["#01B763", "#ff4d4f"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={doughnutOptions}
                />
              </div>
            </Card>
          </Col>

          <Col span={24} lg={24}>
            <Card
              title={
                <div className="flex flex-wrap items-center justify-between gap-1 w-full py-2">
                  <span className="text-[#122751] text-sm md:text-base font-semibold">
                    Invoice Overview
                  </span>

                  <div className="w-full sm:w-auto">
                    <Select
                      defaultValue={invoiceDuration}
                      onChange={(val) => setInvoiceDuration(val)}
                      className="w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 h-8 sm:h-7 md:h-8 lg:h-10 text-sm md:text-base"
                    >
                      <Option value="yearly">Yearly</Option>
                      <Option value="monthly">Monthly</Option>
                      <Option value="weekly">Weekly</Option>
                      <Option value="today">Today</Option>
                    </Select>
                  </div>
                </div>
              }
            >
              <div style={{ height: 300 }}>
                <Line data={invoiceChartData} options={chartOptions} />
              </div>
            </Card>
          </Col>

          <Col span={24} lg={24}>
            <Card
              title={
                <div className="flex  sm:flex-row sm:items-center justify-between gap-1 w-full py-2">
                  <span className="text-[#122751] text-sm md:text-base font-semibold">
                    Recent Invoices
                  </span>
                  <button
                    onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
                    className="text-sm md:text-base font-medium hover:underline cursor-pointer text-[#122751] transition-colors duration-200"
                  >
                    View All →
                  </button>
                </div>
              }
              style={{ height: "100%", padding: "0px" }}
              className="customCard"
            >
              {/* Loading, Error or Table */}
              {recentInvoicesLoading ? (
                <div className="flex justify-center items-center h-full p-5 bg-white">
                  <CommonSkeleton rows={5} />
                </div>
              ) : recentInvoicesError ? (
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
                <CommonTable
                  dataSource={invoices}
                  columns={invoiceTableColumns}
                  pagination={false}
                  rowKey={(record) => record.templateUrl}
                  scroll={
                    invoices.length > 0
                      ? { x: 1000, y: "calc(75vh - 300px)" }
                      : {}
                  }
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <CommonModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewUrl(null);
        }}
        title={null}
        width={1000}
      >
        <div className="flex flex-col h-[80vh]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#122751] text-sm md:text-base font-semibold">
              Invoice Preview
            </h2>
            <RxCross2
              onClick={() => {
                setIsPreviewOpen(false);
                setPreviewUrl(null);
              }}
              className="text-2xl text-[#122751] cursor-pointer hover:bg-[#f0f4ff]"
            />
          </div>

          <div className="flex-1 overflow-hidden rounded-lg relative">
            {isPdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
                <CommonLoader showText={false} />
              </div>
            )}
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                previewUrl
              )}&embedded=true`}
              title="Invoice PDF"
              className="w-full h-full"
              style={{
                border: "none",
                visibility: isPdfLoading ? "hidden" : "visible",
              }}
              onLoad={() => setIsPdfLoading(false)}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Dashboard;
