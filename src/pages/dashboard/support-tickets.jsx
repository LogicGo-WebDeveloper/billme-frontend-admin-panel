import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  // Statistic,
  Select,
  Table,
  // Tag,
  List,
  Input,
  Button,
  Space,
  Modal,
  Avatar,
  Typography,
  Divider,
  Statistic,
} from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  // DollarOutlined,
  SendOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
} from "@ant-design/icons";
// import { Line, Doughnut, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
import PrimaryButton from "../../components/common/primary.button";
import StatusBadge from "../../components/common/commonBadge";
import CommonTable from "../../components/CommonTable";

const { TextArea } = Input;
const { Title: TypographyTitle, Text } = Typography;
const { Option } = Select;

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

const SupportTickets = () => {
  const [ticketTrendDuration, setTicketTrendDuration] = useState("monthly");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);

  const totalTickets = 250;
  const openTickets = 80;
  const closedTickets = 170;
  const highPriorityTickets = 25;

  // const ticketTrendData = {
  //   yearly: {
  //     labels: ["2020", "2021", "2022", "2023", "2024"],
  //     data: [80, 150, 180, 220, 250],
  //   },
  //   monthly: {
  //     labels: [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ],
  //     data: [15, 20, 18, 25, 22, 30, 28, 35, 32, 38, 40, 45],
  //   },
  //   weekly: {
  //     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //     data: [5, 8, 7, 10, 12, 15, 10],
  //   },
  //   daily: {
  //     labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
  //     data: [1, 2, 3, 2, 4, 3, 5],
  //   },
  // };

  // const chartData = {
  //   labels: ticketTrendData[ticketTrendDuration].labels,
  //   datasets: [
  //     {
  //       label: "Tickets Created",
  //       data: ticketTrendData[ticketTrendDuration].data,
  //       borderColor: "#01B763",
  //       backgroundColor: "rgba(1, 183, 99, 0.1)",
  //       tension: 0.4,
  //       fill: true,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: { legend: { position: "top" } },
  //   scales: { y: { beginAtZero: true } },
  // };

  // const ticketStatusData = {
  //   labels: ["Open", "Closed", "Pending", "Resolved"],
  //   datasets: [
  //     {
  //       data: [30, 50, 10, 10],
  //       backgroundColor: ["#1890ff", "#01B763", "#faad14", "#2db7f5"],
  //     },
  //   ],
  // };

  // const ticketPriorityData = {
  //   labels: ["High", "Medium", "Low"],
  //   datasets: [
  //     {
  //       label: "Number of Tickets",
  //       data: [25, 60, 165],
  //       backgroundColor: ["#ff4d4f", "#faad14", "#1890ff"],
  //     },
  //   ],
  // };

  const tickets = [
    {
      key: "1",
      id: "TKT001",
      subject: "Payment gateway issue",
      customer: "Alice Johnson",
      status: "Open",
      priority: "High",
      assignedTo: "Support Team A",
      lastUpdate: "2 hours ago",
      messages: [
        {
          sender: "Alice Johnson",
          message:
            "I'm unable to process payments through the gateway. Getting an error message.",
          time: "2 hours ago",
          isAdmin: false,
        },
        {
          sender: "Support Team A",
          message:
            "We're looking into this issue. Can you please share the error message you're seeing?",
          time: "1 hour ago",
          isAdmin: true,
        },
        {
          sender: "Alice Johnson",
          message:
            "The error says: 'Transaction failed. Please try again later.'",
          time: "58 minutes ago",
          isAdmin: false,
        },
        {
          sender: "Support Team A",
          message: "Thanks. We're checking logs with our payment provider.",
          time: "45 minutes ago",
          isAdmin: true,
        },
        {
          sender: "Alice Johnson",
          message:
            "The error says: 'Transaction failed. Please try again later.'",
          time: "58 minutes ago",
          isAdmin: false,
        },
        {
          sender: "Support Team A",
          message: "Thanks. We're checking logs with our payment provider.",
          time: "45 minutes ago",
          isAdmin: true,
        },
      ],
    },
    {
      key: "2",
      id: "TKT002",
      subject: "Login not working",
      customer: "Bob Smith",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "Support Team B",
      lastUpdate: "1 hour ago",
      messages: [
        {
          sender: "Bob Smith",
          message:
            "I can't log into my account. It keeps saying 'Invalid credentials'.",
          time: "3 hours ago",
          isAdmin: false,
        },
        {
          sender: "Support Team B",
          message: "Hi Bob, did you try resetting your password?",
          time: "2 hours ago",
          isAdmin: true,
        },
        {
          sender: "Bob Smith",
          message: "Yes, but the reset email never came.",
          time: "1 hour 30 minutes ago",
          isAdmin: false,
        },
        {
          sender: "Support Team B",
          message:
            "We've re-sent the email. Please check your spam folder too.",
          time: "1 hour ago",
          isAdmin: true,
        },
      ],
    },
    {
      key: "3",
      id: "TKT003",
      subject: "Unable to upload documents",
      customer: "Carlos Mendes",
      status: "Pending",
      priority: "Low",
      assignedTo: "Support Team C",
      lastUpdate: "30 minutes ago",
      messages: [
        {
          sender: "Carlos Mendes",
          message: "Upload keeps failing for PDF files above 5MB.",
          time: "2 hours ago",
          isAdmin: false,
        },
        {
          sender: "Support Team C",
          message:
            "Carlos, our current limit is 5MB. We'll raise a request to increase it.",
          time: "1 hour ago",
          isAdmin: true,
        },
        {
          sender: "Carlos Mendes",
          message: "Thanks. That will be helpful.",
          time: "45 minutes ago",
          isAdmin: false,
        },
        {
          sender: "Support Team C",
          message: "We've escalated it. Will update you by tomorrow.",
          time: "30 minutes ago",
          isAdmin: true,
        },
      ],
    },
    {
      key: "4",
      id: "TKT004",
      subject: "Billing discrepancy",
      customer: "Diana Cruz",
      status: "Closed",
      priority: "High",
      assignedTo: "Billing Team",
      lastUpdate: "1 day ago",
      messages: [
        {
          sender: "Diana Cruz",
          message: "My invoice shows extra charges for last month.",
          time: "2 days ago",
          isAdmin: false,
        },
        {
          sender: "Billing Team",
          message: "Diana, we'll verify your billing and revert shortly.",
          time: "1 day 22 hours ago",
          isAdmin: true,
        },
        {
          sender: "Billing Team",
          message:
            "Confirmed, the charge was incorrect. A refund has been initiated.",
          time: "1 day ago",
          isAdmin: true,
        },
        {
          sender: "Diana Cruz",
          message: "Thank you for resolving it promptly.",
          time: "23 hours ago",
          isAdmin: false,
        },
      ],
    },
  ];

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log("Sending reply:", replyText);
      setReplyText("");
      setIsReplyModalVisible(false);
    }
  };

  const ticketTableColumns = [
    { title: "Ticket ID", dataIndex: "id", key: "id" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const badgeMap = {
          Open: { bgColor: "#DBEAFE", textColor: "#1E3A8A" },
          Closed: { bgColor: "#DCFCE7", textColor: "#166534" },
          Pending: { bgColor: "#FEF3C7", textColor: "#92400E" },
          Resolved: { bgColor: "#CFFAFE", textColor: "#155E75" },
        };
        const { bgColor, textColor } = badgeMap[status] || {};
        return (
          <StatusBadge label={status} bgColor={bgColor} textColor={textColor} />
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const badgeMap = {
          High: { bgColor: "#FEE2E2", textColor: "#B91C1C" },
          Medium: { bgColor: "#FEF3C7", textColor: "#92400E" },
          Low: { bgColor: "#DCFCE7", textColor: "#15803D" },
        };
        const { bgColor, textColor } = badgeMap[priority] || {};
        return (
          <StatusBadge
            label={priority}
            bgColor={bgColor}
            textColor={textColor}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PrimaryButton
            type="primary"
            onClick={() => {
              setSelectedTicket(record);
              setIsTicketModalVisible(true);
            }}
            style={{ width: 80, height: 32, fontSize: "12px" }}
          >
            View
          </PrimaryButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {/* Commented out all statistics cards */}
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={totalTickets}
              valueStyle={{ color: "#01B763" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={openTickets}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Closed Tickets"
              value={closedTickets}
              valueStyle={{ color: "#01B763" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="High Priority"
              value={highPriorityTickets}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col> */}

        {/* Commented out all charts */}
        {/* <Col span={24} lg={16}>
          <Card
            title={
              <>
                <span>Ticket Trend</span>
                <Select
                  defaultValue={ticketTrendDuration}
                  onChange={setTicketTrendDuration}
                  style={{ float: "right", width: 120 }}
                >
                  <Option value="yearly">Yearly</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="daily">Daily</Option>
                </Select>
              </>
            }
          >
            <Line data={chartData} options={chartOptions} />
          </Card>
        </Col>
        <Col span={24} lg={8}>
          <Card title="Ticket Status Summary">
            <Doughnut
              data={ticketStatusData}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card title="Tickets by Priority">
            <Bar data={ticketPriorityData} options={chartOptions} />
          </Card>
        </Col> */}

        {/* Only the table remains visible */}
        <Col span={24}>
          {/* <Card title="All Support Tickets"> */}
          <CommonTable
            dataSource={tickets}
            columns={ticketTableColumns}
            scroll={{ x: 1000 }}
            rowKey="id"
            pagination={true}
          />
          {/* </Card> */}
        </Col>
      </Row>

      <Modal
        title={`Ticket #${selectedTicket?.id} - ${selectedTicket?.subject}`}
        open={isTicketModalVisible}
        onCancel={() => setIsTicketModalVisible(false)}
        width={800}
        centered
        footer={[
          <div className="flex justify-end">
            <Button key="close" onClick={() => setIsTicketModalVisible(false)}>
              Close
            </Button>
            ,
            <PrimaryButton
              key="reply"
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                setIsTicketModalVisible(false);
                setIsReplyModalVisible(true);
              }}
              style={{ marginLeft: 8, width: 100, height: 40 }}
            >
              Reply
            </PrimaryButton>
            ,
          </div>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Customer:</Text> {selectedTicket?.customer}
          <Divider />
        </div>
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            padding: "0 16px",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
          }}
        >
          <TypographyTitle level={5}>Conversation</TypographyTitle>
          <List
            itemLayout="horizontal"
            dataSource={selectedTicket?.messages || []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={
                        item.isAdmin ? (
                          <CustomerServiceOutlined />
                        ) : (
                          <UserOutlined />
                        )
                      }
                      style={{
                        backgroundColor: item.isAdmin ? "#1890ff" : "#52c41a",
                      }}
                    />
                  }
                  title={
                    <Space>
                      <Text strong>{item.sender}</Text>
                      <Text type="secondary">{item.time}</Text>
                    </Space>
                  }
                  description={item.message}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        title={`Reply to Ticket ${selectedTicket?.id}`}
        open={isReplyModalVisible}
        onCancel={() => setIsReplyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsReplyModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="send"
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendReply}
          >
            Send Reply
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Subject: {selectedTicket?.subject}</Text>
          <Divider style={{ margin: "12px 0" }} />
          <TextArea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default SupportTickets;
