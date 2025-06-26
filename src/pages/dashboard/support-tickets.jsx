import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Table,
  List,
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  Divider,
  Statistic,
  Pagination,
  Tooltip,
} from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  DollarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PrimaryButton from "../../components/common/primary.button";
import StatusBadge from "../../components/common/commonBadge";
import CommonTable from "../../components/CommonTable";
import { useFetch, useMutate, useQueryState } from "../../hooks/useQuery";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { QUERY_KEYS, QUERY_METHODS } from "../../config/query.const";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import dayjs from "dayjs";
import CommonModal from "../../components/common/commonModal";
import { message as antdMessage } from "antd";
import LoadingButton from "../../components/common/loading-button";
import { Content } from "antd/es/layout/layout";
import CommonError from "../../components/common/CommonError";

const { TextArea } = Input;
const { Title: TypographyTitle, Text } = Typography;
const { Option } = Select;

const SupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const [replyLoading, setReplyLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const buildQueryURL = () => {
    let url = `${ROUTE_PATH.SUPPORT_REQUEST.GET_ALL_TICKETS}?page=${currentPage}&limit=${pageSize}`;
    if (statusFilter !== "all") {
      url += `&status=${statusFilter}`;
    }
    if (searchText?.trim()) {
      url += `&search=${encodeURIComponent(searchText.trim())}`;
    }
    return url;
  };

  const query = useFetch(
    [
      QUERY_KEYS.SUPPORT_REQUEST.GET_ALL_TICKETS,
      currentPage,
      pageSize,
      statusFilter,
      searchText,
    ],
    buildQueryURL(),
    { refetchOnWindowFocus: false }
  );

  const { isLoading, isError, data, error } = useQueryState(query);
  const tickets = (data?.data || []).map((ticket) => ({
    key: ticket._id,
    id: ticket._id,
    subject: ticket.subject || "-",
    customer: ticket.userId?.email || "-",
    description: ticket.description || "-",
    status:
      ticket.status === "close"
        ? "Closed"
        : ticket.status === "open"
        ? "Open"
        : ticket.status,
    messages: (ticket.messages || []).map((msg) => ({
      sender:
        msg.senderType === "admin"
          ? "Admin"
          : ticket.userId?.email || ticket.email,
      message: msg.message,
      time: dayjs(msg.timestamp).format("DD MMM YYYY, hh:mm A"),
      isAdmin: msg.senderType === "admin",
    })),
  }));

  const totalTickets = data?.ticketsCount?.totalTicket || 0;
  const openTickets = data?.ticketsCount?.openTicket || 0;
  const closedTickets = data?.ticketsCount?.closedTicket || 0;
  const paginatedTicketCount = data?.pagination?.totalCount || 0;

  const { mutate: sendReplyMutation } = useMutate(
    [QUERY_KEYS.SUPPORT_REQUEST.REPLY_TICKET, selectedTicket?.id],
    QUERY_METHODS.POST,
    selectedTicket
      ? ROUTE_PATH.SUPPORT_REQUEST.REPLY_TO_TICKET(selectedTicket.id)
      : "",
    {
      onSuccess: () => {
        messageApi.success("Reply sent successfully!");
        setReplyText("");
        setReplyLoading(false);
        setIsReplyModalVisible(false);
        setIsTicketModalVisible(true);

        query.refetch().then((newData) => {
          // Find the updated ticket from the new data
          const updatedTicket = (newData?.data?.data || []).find(
            (t) => t._id === selectedTicket.id
          );
          if (updatedTicket) {
            setSelectedTicket({
              key: updatedTicket._id,
              id: updatedTicket._id,
              subject: updatedTicket.subject || "-",
              customer:
                updatedTicket.userId?.email || updatedTicket.email || "-",
              description: updatedTicket.description || "-",
              status:
                updatedTicket.status === "close"
                  ? "Closed"
                  : updatedTicket.status === "open"
                  ? "Open"
                  : updatedTicket.status,
              messages: (updatedTicket.messages || []).map((msg) => ({
                sender:
                  msg.senderType === "admin"
                    ? "Admin"
                    : updatedTicket.userId?.email || updatedTicket.email,
                message: msg.message,
                time: dayjs(msg.timestamp).format("DD MMM YYYY, hh:mm A"),
                isAdmin: msg.senderType === "admin",
              })),
            });
          }
        });
      },
      onError: (error) => {
        console.log("Reply error:", error);
        setReplyLoading(false);
        messageApi.error(
          error?.response?.data?.message ||
            "Failed to send reply. Please try again."
        );
      },
    }
  );

  const handleSendReply = () => {
    if (!replyText.trim()) {
      messageApi.warning("Reply message cannot be empty.");
      return;
    }
    setReplyLoading(true);
    sendReplyMutation({ message: replyText });
  };

  const ticketTableColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Email",
      dataIndex: "customer",
      key: "customer",
      width: 200,
      render: (text) => text,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 180,
      render: (text) => text,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <span className="truncate block  text-center">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const normalized = status?.toLowerCase();
        const bgColor = normalized === "open" ? "#fee2e2" : "#d1d5db";
        const textColor = normalized === "open" ? "#b91c1c" : "#111827";

        return (
          <StatusBadge label={status} bgColor={bgColor} textColor={textColor} />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex justify-center">
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

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleCardClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const summaryCards = [
    {
      title: "Total Tickets",
      value: totalTickets,
      icon: <DollarOutlined className="text-xl" />,
      bgColor: "#DBEAFE",
      iconColor: "#1D4ED8",
      status: "all",
    },
    {
      title: "Open Tickets",
      value: openTickets,
      icon: <ExclamationCircleOutlined className="text-xl" />,
      bgColor: "#D1FAE5",
      iconColor: "#059669",
      status: "open",
    },
    {
      title: "Closed Tickets",
      value: closedTickets,
      icon: <CheckCircleOutlined className="text-xl" />,
      bgColor: "#FEF3C7",
      iconColor: "#F59E0B",
      status: "close",
    },
  ];

  return (
    <>
      {contextHolder}

      {/* Statistics Cards */}
      <div style={{ padding: 24 }}>
        <Row gutter={[16, 16]}>
          {summaryCards.map((item, index) => (
            <Col xs={24} sm={24} lg={8} key={index}>
              <Card
                loading={isLoading}
                className={`rounded-2xl shadow-md border h-full cursor-pointer transition-all duration-200 ${
                  statusFilter === item.status
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-100"
                }`}
                onClick={() => handleCardClick(item.status)}
              >
                <div className="flex items-center h-[60px] gap-4">
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
                    <div className="text-gray-500 text-sm leading-snug break-words max-w-full">
                      {item.title}
                    </div>
                    <div className="text-2xl font-semibold text-gray-800">
                      {item.value}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Search & Filter */}
      <div className="p-6 pt-0 pb-4">
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
      <Content className="mx-6 mb-6 bg-white rounded-b-sm max-h-[calc(90vh-800px)]">
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
              <CommonTable
                columns={ticketTableColumns}
                dataSource={tickets}
                rowKey="id"
                pagination={false}
                scroll={
                  tickets.length > 0 ? { x: 1000, y: "calc(85vh - 300px)" } : {}
                }
              />

              <div className="w-full flex justify-center sm:justify-end px-2 py-1 bg-white">
                {/* Mobile - Centered without size changer */}
                <div className="sm:hidden">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={paginatedTicketCount}
                    onChange={handlePaginationChange}
                    showSizeChanger={false}
                    responsive
                  />
                </div>

                {/* Desktop - Right-aligned with size changer */}
                <div className="hidden sm:block">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={paginatedTicketCount}
                    onChange={handlePaginationChange}
                    showSizeChanger={true}
                    responsive
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Content>

      {/* Ticket Details Modal - Responsive */}
      <CommonModal
        isOpen={isTicketModalVisible}
        onClose={() => setIsTicketModalVisible(false)}
        width={Math.min(window.innerWidth - 16, 800)}
        bodyStyle={{ padding: window.innerWidth < 600 ? 8 : 16 }}
        title={
          <div className="flex flex-col gap-1 max-w-full">
            <Tooltip title={selectedTicket?.subject} placement="bottomLeft">
              <span className="text-base font-semibold truncate max-w-full sm:max-w-[680px]">
                {`Subject: ${selectedTicket?.subject}`}
              </span>
            </Tooltip>
            <Tooltip title={selectedTicket?.description} placement="bottomLeft">
              <span className="text-sm text-gray-500 truncate max-w-full sm:max-w-[680px]">
                {`Description: ${selectedTicket?.description}`}
              </span>
            </Tooltip>
          </div>
        }
        footer={
          <div className="flex justify-end flex-wrap gap-2">
            <Button key="close" onClick={() => setIsTicketModalVisible(false)}>
              Close
            </Button>
            <PrimaryButton
              key="reply"
              type="primary"
              onClick={() => {
                setIsTicketModalVisible(false);
                setIsReplyModalVisible(true);
              }}
              style={{ width: 90, height: 31, fontSize: 14 }}
            >
              Reply
            </PrimaryButton>
          </div>
        }
      >
        <div className="mb-4">
          <Text strong>Customer:</Text> {selectedTicket?.customer}
        </div>
        <div
          className="border rounded-md overflow-y-auto"
          style={{
            maxHeight: window.innerWidth < 600 ? "250px" : "400px",
            padding: window.innerWidth < 600 ? "0 4px" : "0 12px",
            borderColor: "#f0f0f0",
          }}
        >
          <TypographyTitle level={5} className="!mb-2 !mt-2 sm:!mt-0">
            Conversation
          </TypographyTitle>
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
                    <Space direction="vertical" size={0}>
                      <Text strong>{item.sender}</Text>
                      <Text type="secondary" className="text-xs">
                        {item.time}
                      </Text>
                    </Space>
                  }
                  description={
                    <div className="whitespace-pre-wrap break-words max-w-full">
                      {item.message}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </CommonModal>

      {/* Reply Modal */}
      <CommonModal
        isOpen={isReplyModalVisible}
        onClose={() => {
          setIsReplyModalVisible(false);
          setIsTicketModalVisible(true);
        }}
        title={`Reply to Ticket : ${selectedTicket?.id}`}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsReplyModalVisible(false);
              setIsTicketModalVisible(true);
            }}
          >
            Cancel
          </Button>,
          <PrimaryButton
            key="send"
            {...(replyLoading ? { disabled: true } : {})}
            onClick={handleSendReply}
            style={{ marginLeft: 8, width: 110, height: 31, fontSize: 14 }}
          >
            {replyLoading ? <LoadingButton size="small" /> : "Send Reply"}
          </PrimaryButton>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Tooltip title={selectedTicket?.subject} placement="bottomLeft">
            <Text className="truncate block max-w-full sm:max-w-[680px]">
              <strong>Subject:</strong> {selectedTicket?.subject}
            </Text>
          </Tooltip>
          <Divider style={{ margin: "12px 0" }} />
          <TextArea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
          />
        </div>
      </CommonModal>
    </>
  );
};

export default SupportTickets;
