import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Typography,
  Space,
  Select,
  Table,
  Divider,
  Skeleton,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
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
import {
  RiMoneyDollarCircleFill,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";

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
  const [revenueDuration, setRevenueDuration] = useState("monthly");
  const [invoiceDuration, setInvoiceDuration] = useState("monthly");
  const navigate = useNavigate();

  // const buildDashboardQueryURL = () => {
  //   const base = `${ROUTE_PATH.DASHBOARD.GET_DASHBOARD}`;
  //   const params = new URLSearchParams();

  //   if (userTimeType) params.append("userTimeType", userTimeType);

  //   return `${base}?${params.toString()}`;
  // };

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
  console.log("userChartRaw", userChartRaw);

  const userChart = {
    labels: transformChartLabels(userChartRaw?.totalUsers),
    all: transformChartData(userChartRaw?.totalUsers),
    subscribed: transformChartData(userChartRaw?.subscribeUsers),
    notSubscribed: transformChartData(userChartRaw?.unsubscribedUsers),
  };

  // console.log("userChart", userChart);

  const invoiceChartRaw = dashboardData?.invoiceChart || {};
  console.log("invoiceChartRaw", invoiceChartRaw);

  const invoiceChart = {
    labels: transformChartLabels(invoiceChartRaw?.Paid),
    paid: transformChartData(invoiceChartRaw?.Paid),
    unpaid: transformChartData(invoiceChartRaw?.Unpaid),
    overdue: transformChartData(invoiceChartRaw?.OverDue),
  };

  const invoiceChartData = {
    labels: invoiceChart.labels,
    datasets: [
      {
        label: "Paid",
        data: invoiceChart.paid,
        borderColor: "#01B763",
        backgroundColor: "rgba(1, 183, 99, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Unpaid",
        data: invoiceChart.unpaid,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Overdue",
        data: invoiceChart.overdue,
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  console.log("invoiceChart", invoiceChart);

  console.log("userChart", userChart);

  const buildRecentInvoicesURL = () =>
    `${ROUTE_PATH.INVOICE.GET_ALL_INVOICES}?limit=10&page=1&sortBy=createdAt:desc`;

  const recentInvoicesQuery = useFetch(
    [QUERY_KEYS.INVOICE.RECENT_INVOICES],
    buildRecentInvoicesURL(),
    { refetchOnWindowFocus: false }
  );

  const { data: recentInvoicesData, isLoading: recentInvoicesLoading } =
    useQueryState(recentInvoicesQuery);
  const invoices = recentInvoicesData?.data || [];

  if (isLoading) {
    return <CommonLoader />;
  }

  const userData = {
    yearly: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      all: [800, 1200, 1800, 2400, 2600],
      subscribed: [500, 900, 1300, 1800, 2000],
      notSubscribed: [300, 300, 500, 600, 600],
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      all: [200, 250, 300, 280, 350, 400, 420, 410, 390, 420, 430, 480],
      subscribed: [150, 180, 220, 200, 270, 310, 320, 310, 300, 330, 340, 380],
      notSubscribed: [50, 70, 80, 80, 100, 90, 100, 120, 90, 90, 90, 140],
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      all: [120, 150, 170, 160, 200, 220, 180],
      subscribed: [90, 110, 130, 120, 150, 170, 140],
      notSubscribed: [30, 40, 40, 40, 50, 50, 40],
    },
    daily: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      all: [25, 40, 60, 50, 70, 90, 100],
      subscribed: [18, 30, 45, 35, 50, 65, 75],
      notSubscribed: [7, 10, 15, 15, 20, 25, 25],
    },
  };

  const invoiceData = {
    yearly: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      datasets: {
        paid: [1000, 1500, 1800, 2200, 2400],
        unpaid: [300, 400, 350, 300, 250],
        overdue: [100, 150, 200, 180, 160],
      },
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: {
        paid: [200, 220, 250, 230, 270, 290, 310, 320, 300, 330, 340, 360],
        unpaid: [50, 60, 55, 65, 60, 58, 62, 59, 57, 63, 61, 60],
        overdue: [20, 18, 22, 21, 23, 25, 20, 22, 21, 24, 26, 28],
      },
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: {
        paid: [300, 320, 310, 305, 330, 340, 350],
        unpaid: [80, 85, 82, 80, 83, 85, 88],
        overdue: [20, 22, 21, 23, 24, 26, 25],
      },
    },
    daily: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      datasets: {
        paid: [30, 35, 40, 38, 42, 45, 50],
        unpaid: [10, 12, 11, 13, 12, 14, 15],
        overdue: [3, 4, 4, 5, 5, 6, 6],
      },
    },
  };

  // const userChartData = {
  //   labels: userData[userTimeType].labels,
  //   datasets: [
  //     {
  //       label: "All Users",
  //       data: userData[userTimeType].all,
  //       borderColor: "#01B763",
  //       backgroundColor: "rgba(1, 183, 99, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //     {
  //       label: "Subscribed Users",
  //       data: userData[userTimeType].subscribed,
  //       borderColor: "#1890ff",
  //       backgroundColor: "rgba(24, 144, 255, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //     {
  //       label: "Not Subscribed Users",
  //       data: userData[userTimeType].notSubscribed,
  //       borderColor: "#ff4d4f",
  //       backgroundColor: "rgba(255, 77, 79, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //   ],
  // };

  const chartData = {
    labels: userChart.labels,
    datasets: [
      {
        label: "All Users",
        data: userChart.all,
        borderColor: "#01B763",
        backgroundColor: "rgba(1, 183, 99, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Subscribed Users",
        data: userChart.subscribed,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Not Subscribed Users",
        data: userChart.notSubscribed,
        borderColor: "#ff4d4f",
        backgroundColor: "rgba(255, 77, 79, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const revenueByDuration = {
    yearly: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      data: [12000, 15000, 18000, 22000, 25000],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [1000, 1200, 1500, 1300, 1600, 1800],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [400, 440, 380, 500],
    },
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [150, 180, 170, 200, 190, 220, 210],
    },
  };

  const revenueChartData = {
    labels: revenueByDuration[revenueDuration].labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueByDuration[revenueDuration].data,
        backgroundColor: "#01B763",
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
            const value = context.raw || 0;
            return `${value}%`;
          },
        },
      },
    },
  };

  const recentActivities = [
    {
      title: "New Invoice Created",
      description: "Invoice #1234 was created",
      time: "2 hours ago",
    },
    {
      title: "Payment Received",
      description: "Payment of $1,200 received",
      time: "5 hours ago",
    },
    {
      title: "New Customer Added",
      description: "John Doe added as new customer",
      time: "1 day ago",
    },
  ];

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
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
          style={{ width: 100, height: 32, fontSize: "12px" }}
        >
          View
        </PrimaryButton>
      ),
    },
  ];

  // const invoiceChartData = {
  //   labels: invoiceData[invoiceDuration].labels,
  //   datasets: [
  //     {
  //       label: "Paid",
  //       data: invoiceData[invoiceDuration].datasets.paid,
  //       borderColor: "#01B763",
  //       backgroundColor: "rgba(1, 183, 99, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //     {
  //       label: "Unpaid",
  //       data: invoiceData[invoiceDuration].datasets.unpaid,
  //       borderColor: "#1890ff",
  //       backgroundColor: "rgba(24, 144, 255, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //     {
  //       label: "Overdue",
  //       data: invoiceData[invoiceDuration].datasets.overdue,
  //       borderColor: "#ff4d4f",
  //       backgroundColor: "rgba(255, 77, 79, 0.1)",
  //       tension: 0.4,
  //       fill: false,
  //     },
  //   ],
  // };

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row gutter={[16, 16]} style={{ flex: 1 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#DBEAFE] text-[#1D4ED8] p-3 rounded-full">
                <UserOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Customers</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.userSummary?.totalUsers || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#D1FAE5] text-[#059669] p-3 rounded-full">
                <FileTextOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Invoices</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.totalInvoices || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#EDE9FE] text-[#7C3AED] p-2 rounded-full">
                <MdAttachMoney className="text-2xl" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">
                  Subscribed Customers
                </div>
                <div className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.userSummary?.subscribeUsers || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#FEF3C7] text-[#F59E0B] p-3 rounded-full">
                <UserOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">
                  Not Subscribed Customers
                </div>
                <div className="text-2xl font-semibold text-gray-800">
                  {dashboardData?.userSummary?.unsubscribedUsers || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={24} lg={16}>
          <Card
            title={
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Users Overview
                </span>

                <div className="w-full sm:w-auto">
                  <Select
                    defaultValue={userTimeType}
                    onChange={(val) => setUserTimeType(val)}
                    style={{ width: "100%", minWidth: 120, maxWidth: 150 }}
                    className="w-full"
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
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Tickets Status
                </span>
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

        {/* <Col span={24} lg={12}>
          <Card
            title={
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Revenue Overview
                </span>

                <div className="w-full sm:w-auto">
                  <Select
                    defaultValue={revenueDuration}
                    onChange={(val) => setRevenueDuration(val)}
                    style={{ width: "100%", minWidth: 120, maxWidth: 150 }}
                    className="w-full"
                  >
                    <Option value="yearly">Yearly</Option>
                    <Option value="monthly">Monthly</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="daily">Daily</Option>
                  </Select>
                </div>
              </div>
            }
          >
            <div style={{ height: 300 }}>
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </Card>
        </Col> */}

        <Col span={24} lg={24}>
          <Card
            title={
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Invoice Overview
                </span>

                <div className="w-full sm:w-auto">
                  <Select
                    defaultValue={invoiceDuration}
                    onChange={(val) => setInvoiceDuration(val)}
                    style={{ width: "100%", minWidth: 120, maxWidth: 150 }}
                    className="w-full"
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
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Recent Invoices
                </span>
              </div>
            }
            style={{ height: "100%", padding: "0px" }}
            className="customCard"
          >
            <CommonTable
              dataSource={invoices}
              columns={invoiceTableColumns}
              pagination={false}
              rowKey="id"
              scroll={
                invoices.length > 0 ? { x: 1000, y: "calc(75vh - 300px)" } : {}
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
