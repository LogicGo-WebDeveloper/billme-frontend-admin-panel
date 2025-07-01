import React, { useState } from "react";
import {
  Input,
  Select,
  Pagination,
  message as antdMessage,
  Button,
} from "antd";
import { useSelector } from "react-redux";
import CommonTable from "../../components/CommonTable";
import CommonSkeleton from "../../components/common/CommonSkeleton";
import CommonModal from "../../components/common/commonModal";
import PrimaryButton from "../../components/common/primary.button";
import SecondryButton from "../../components/common/secondry.button";
import StatusBadge from "../../components/common/commonBadge";
import {
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useFetch, useQueryState, useMutate } from "../../hooks/useQuery";
import { ROUTE_PATH } from "../../config/api-routes.config";
import { QUERY_KEYS, QUERY_METHODS } from "../../config/query.const";
import dayjs from "dayjs";
import CommonError from "../../components/common/CommonError";

const Admins = () => {
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = antdMessage.useMessage();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Get current user role from store
  const currentUserRole = useSelector((state) => state.user?.user?.role);

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

  // Mutation for updating admin status
  const updateStatusMutation = useMutate(
    [QUERY_KEYS.ADMINS_USERS.UPDATE_ADMIN_STATUS],
    QUERY_METHODS.PATCH,
    ROUTE_PATH.ADMINS_USERS.UPDATE_ADMIN_STATUS,
    {
      onSuccess: (data) => {
        messageApi.success(data.message || "Status updated successfully");
        query.refetch();
      },
      onError: (error) => {
        messageApi.error(
          error?.response?.data?.message || "Failed to update status"
        );
      },
    }
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

  // Function to handle status update
  const handleStatusUpdate = (adminId, status) => {
    updateStatusMutation.mutate({
      registerAdminId: adminId,
      status: status,
    });
  };

  // Function to open confirmation modal
  const openStatusModal = (admin, status) => {
    setSelectedAdmin(admin);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  // Function to confirm status change
  const confirmStatusChange = () => {
    if (selectedAdmin && newStatus) {
      handleStatusUpdate(selectedAdmin._id, newStatus);
      setIsModalOpen(false);
      setSelectedAdmin(null);
      setNewStatus("");
    }
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
    setNewStatus("");
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("DD MMM YYYY") : "-",
    },
    {
      title: "Status",
      dataIndex: "ownerApproveStatus",
      key: "ownerApproveStatus",
      width: 200,
      render: (status, record) => {
        // If current user is admin, show only badge
        if (currentUserRole === "admin") {
          let badgeProps = { label: status || "Pending" };
          if (status === "Approved")
            badgeProps = {
              ...badgeProps,
              bgColor: "#d1fae5",
              textColor: "#065f46",
            };
          else if (status === "Rejected")
            badgeProps = {
              ...badgeProps,
              bgColor: "#fee2e2",
              textColor: "#991b1b",
            };
          else
            badgeProps = {
              ...badgeProps,
              bgColor: "#fef3c7",
              textColor: "#92400e",
            };
          return <StatusBadge {...badgeProps} />;
        }
        // Otherwise, show select box as before
        // Define status options based on current status
        const getStatusOptions = (currentStatus) => {
          switch (currentStatus) {
            case "Pending":
              return [
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ];
            case "Approved":
              return [
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ];
            case "Rejected":
              return [
                { label: "Rejected", value: "Rejected" },
                { label: "Approved", value: "Approved" },
              ];
            default:
              return [
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ];
          }
        };

        const getSelectedBgColor = (currentStatus) => {
          switch (currentStatus) {
            case "Pending":
              return "#fef3c7";
            case "Approved":
              return "#d1fae5";
            case "Rejected":
              return "#fee2e2";
            default:
              return "#fef3c7";
          }
        };

        const getSelectedTextColor = (currentStatus) => {
          switch (currentStatus) {
            case "Pending":
              return "#92400e";
            case "Approved":
              return "#065f46";
            case "Rejected":
              return "#991b1b";
            default:
              return "#92400e";
          }
        };

        return (
          <div
            style={{
              backgroundColor: getSelectedBgColor(status),
              color: getSelectedTextColor(status),
              padding: "2px 2px",
              borderRadius: "6px",
              display: "inline-block",
              minWidth: "120px",
            }}
          >
            <Select
              value={status || "Pending"}
              onChange={(value) => openStatusModal(record, value)}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                color: getSelectedTextColor(status),
                fontWeight: "500",
              }}
              size="small"
              loading={updateStatusMutation.isPending}
              options={getStatusOptions(status)}
              styles={{
                popup: {
                  root: {
                    zIndex: 1000,
                  },
                },
              }}
              variant="borderless"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}

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
            popupMatchSelectWidth={false}
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
      <div className="mx-6 mb-6 mt-0 rounded-b-sm bg-white">
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
                      ? { x: 1100, y: "calc(90vh - 300px)" }
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
      </div>

      {/* Status Modal */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        width={550}
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <SecondryButton
              onClick={closeModal}
              style={{ width: "100%", height: "40px" }}
              className="sm:w-[120px]"
            >
              Cancel
            </SecondryButton>
            <PrimaryButton
              onClick={confirmStatusChange}
              loading={updateStatusMutation.isPending}
              style={{ width: "100%", height: "40px" }}
              className="sm:w-[120px]"
            >
              Confirm
            </PrimaryButton>
          </div>
        }
      >
        <div className="py-2">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleOutlined className="text-blue-500 text-lg" />
              <p className="text-gray-700 text-base font-medium">
                Are you sure you want to update this admin's status?
              </p>
            </div>

            {selectedAdmin && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                    Admin Details
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-600 text-sm">Email:</span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base break-all text-right">
                      {selectedAdmin.email}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Current Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        selectedAdmin.ownerApproveStatus === "Approved"
                          ? "bg-green-100 text-green-800"
                          : selectedAdmin.ownerApproveStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedAdmin.ownerApproveStatus || "Pending"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">New Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        newStatus === "Approved"
                          ? "bg-green-100 text-green-800"
                          : newStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {newStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ExclamationCircleOutlined className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Important Note:</p>
                <p className="text-xs sm:text-sm">
                  This action will notify the admin via email and may impact
                  their access rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Admins;
