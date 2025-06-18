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
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
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
  const [duration, setDuration] = useState("monthly");
  const [revenueDuration, setRevenueDuration] = useState("monthly");

  const userData = {
    yearly: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      data: [500, 1200, 1500, 2400, 2000],
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
      data: [120, 190, 150, 250, 220, 300, 310, 280, 260, 290, 320, 850],
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [30, 45, 50, 40, 70, 80, 60],
    },
    daily: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      data: [5, 10, 15, 10, 20, 18, 22],
    },
  };

  const chartData = {
    labels: userData[duration].labels,
    datasets: [
      {
        label: "Users",
        data: userData[duration].data,
        borderColor: "#01B763",
        backgroundColor: "rgba(1, 183, 99, 0.1)",
        tension: 0.4,
        fill: true,
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

  const upcomingInvoices = [
    {
      id: "1",
      invoice: "#M/001",
      customer: "John Dee",
      amount: "$2,500",
      due: "2024-06-20",
      status: "Unpaid",
    },
    {
      id: "2",
      invoice: "#M/002",
      customer: "Jane Keith",
      amount: "$600",
      due: "2024-06-18",
      status: "Paid",
    },
    {
      id: "3",
      invoice: "#M/003",
      customer: "Anne Crop",
      amount: "$2,310",
      due: "2024-06-23",
      status: "Overdue",
    },
    {
      id: "4",
      invoice: "#M/004",
      customer: "Robert Smith",
      amount: "$1,200",
      due: "2024-06-25",
      status: "Unpaid",
    },
    {
      id: "5",
      invoice: "#M/005",
      customer: "Emily Johnson",
      amount: "$850",
      due: "2024-06-19",
      status: "Unpaid",
    },
  ];

  // Table columns configuration
  const invoiceColumns = [
    { title: "Invoice #", dataIndex: "invoice", key: "invoice" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Due Date", dataIndex: "due", key: "due" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const statusConfig = {
          Paid: {
            bgColor: "#DFF6EA",
            textColor: "#029E74",
          },
          Unpaid: {
            bgColor: "#FFF4E5",
            textColor: "#F7931E",
          },
          Overdue: {
            bgColor: "#FDECEA",
            textColor: "#E53935",
          },
          default: {
            bgColor: "#ECEFF1",
            textColor: "#607D8B",
          },
        };

        const config = statusConfig[text] || statusConfig.default;

        return (
          <StatusBadge
            label={text}
            bgColor={config.bgColor}
            textColor={config.textColor}
          />
        );
      },
    },
  ];

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
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={112893}
              precision={2}
              valueStyle={{ color: "#01B763" }}
              prefix={<DollarOutlined />}
            />
            {/* <div style={{ marginTop: 8 }}>
              <span style={{ color: "#01B763" }}>
                <ArrowUpOutlined /> 12%
              </span>
              <span style={{ marginLeft: 8, color: "rgba(0,0,0,0.45)" }}>
                vs last month
              </span>
            </div> */}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={89}
              valueStyle={{ color: "#CF1322" }}
              prefix={<UserOutlined />}
            />
            {/* <div style={{ marginTop: 8 }}>
              <span style={{ color: "#CF1322" }}>
                <ArrowDownOutlined /> 8%
              </span>
              <span style={{ marginLeft: 8, color: "rgba(0,0,0,0.45)" }}>
                vs last month
              </span>
            </div> */}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={156}
              valueStyle={{ color: "#01B763" }}
              prefix={<FileTextOutlined />}
            />
            {/* <div style={{ marginTop: 8 }}>
              <span style={{ color: "#01B763" }}>
                <ArrowUpOutlined /> 12%
              </span>
              <span style={{ marginLeft: 8, color: "rgba(0,0,0,0.45)" }}>
                vs last month
              </span>
            </div> */}
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={23}
              valueStyle={{ color: "#CF1322" }}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: "#CF1322" }}>
                <ArrowDownOutlined /> 6%
              </span>
              <span style={{ marginLeft: 8, color: "rgba(0,0,0,0.45)" }}>
                vs last month
              </span>
            </div>
          </Card>
        </Col> */}

        <Col span={24} lg={16}>
          <Card
            title={
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Users Overview
                </span>

                <div className="w-full sm:w-auto">
                  <Select
                    defaultValue={duration}
                    onChange={(val) => setDuration(val)}
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
              <Line data={chartData} options={chartOptions} />
            </div>
            {/* <Line data={chartData} options={chartOptions} /> */}
          </Card>
        </Col>

        <Col span={24} lg={8}>
          <Card title={
            <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
              <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                Invoice Status
              </span>
            </div>
          }>
            <div style={{ height: 250 }}>
              <Doughnut
                data={{
                  labels: ["Paid", "Unpaid", "Overdue"],
                  datasets: [
                    {
                      data: [60, 25, 15],
                      backgroundColor: ["#01B763", "#1890ff", "#ff4d4f"],
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            </div>
          </Card>
        </Col>

        <Col span={24} lg={12}>
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
        </Col>

        {/* <Col span={24} lg={12}>
          <Card
            title={
              <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2">
                <span className="text-[#122751] text-[16px] sm:text-[16px] font-semibold">
                  Upcoming Invoices
                </span>
              </div>
            }
            style={{ height: "100%", padding: "0px" }}
            extra={
              <PrimaryButton
                type="primary"
                size="small"
                style={{ width: "auto", height: "30px", fontSize: "12px" }}
              >
                View All
              </PrimaryButton>
            }
          >
            <CommonTable
              dataSource={upcomingInvoices}
              columns={invoiceColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              scroll={
                upcomingInvoices.length > 0
                  ? { x: 1000, y: "calc(100vh - 300px)" }
                  : {}
              }
            />
          </Card>
        </Col> */}

        {/* <Col span={24} lg={12}>
          <Card title="Recent Activities" style={{ height: "100%" }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <div>{item.time}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default Dashboard;
