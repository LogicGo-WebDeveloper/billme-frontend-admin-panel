import React, { useState, useEffect } from "react";
import {
  MenuOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Drawer,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Input,
  Breadcrumb,
} from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import authIconExpanded from "../../assets/images/auth-icon-left.webp";
import authIconCollapsed from "../../assets/images/mint-icon-small.webp";
import { ROUTES } from "../../config/route.const";
import { useDispatch, useSelector } from "react-redux";
import { BiSupport } from "react-icons/bi";
import DrawerImage from "../../assets/images/auth-icon-left.webp";
import { RxCross2, RxAvatar } from "react-icons/rx";
import { MdAddBusiness } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GrUserAdmin } from "react-icons/gr";
import { logout } from "../../store/slices/userSlice";


const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const Home = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "1", icon: <LineChartOutlined />, label: "Dashboard", path: "/" },
    { key: "2", icon: <UserOutlined />, label: "Users", path: "/users" },
    { key: "3", icon: <GrUserAdmin size={14} />, label: "Admins", path: "/admins" },
    {
      key: "4",
      icon: <BiSupport />,
      label: "Tickets",
      path: "/support-tickets",
    },
    { key: "5", icon: <LiaFileInvoiceDollarSolid />, label: "Invoices", path: "/invoices" },
  ];

  const userMenuItems = [
    // { key: "1", icon: <UserOutlined />, label: "Profile" },
    // { key: "2", icon: <SettingOutlined />, label: "Settings" },
    { key: "3", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const getSelectedKey = () => {
    const found = menuItems.find((item) => location.pathname === item.path);
    return found?.key || "1";
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "3") {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate(ROUTES.ADMIN.LOGIN);
    }
  };

  return (
    <Layout hasSider>
      {isMobile && (
        <Drawer
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <img
                src={DrawerImage}
                alt="logo"
                style={{
                  maxWidth: "100px",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <RxCross2
                onClick={() => setDrawerVisible(false)}
                size={21}
                className="cursor-pointer"
              />
            </div>
          }
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
          width={200}
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={({ key }) => {
              const item = menuItems.find((i) => i.key === key);
              navigate(item.path);
              setDrawerVisible(false);
            }}
            items={menuItems}
            style={{ height: "100%", borderRight: 0 }}
            className="custom-menu"
          />
        </Drawer>
      )}

      {!isMobile && (
        <Sider
          collapsed={siderCollapsed}
          onCollapse={(value) => setSiderCollapsed(value)}
          width={200}
          collapsedWidth={80}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 2,
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
          }}
          className="custom-menu"
        >
          <div className="flex items-center justify-center h-16 bg-white transition-all duration-300 border-r border-b border-gray-100">
            <img
              src={siderCollapsed ? authIconCollapsed : authIconExpanded}
              alt="Logo"
              className={`transition-all duration-300 object-contain   ${
                siderCollapsed ? "w-7 h-8" : "w-30 h-8"
              }`}
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={({ key }) => {
              const item = menuItems.find((i) => i.key === key);
              navigate(item.path);
            }}
            items={menuItems}
          />
        </Sider>
      )}

      <Layout
        className={`transition-all duration-200 min-h-screen ${
          !isMobile ? (siderCollapsed ? "ml-[80px]" : "ml-[200px]") : ""
        }`}
      >
        <Header
          style={{ paddingRight: "24px", paddingLeft: "0" }}
          className="flex items-center justify-between bg-white shadow sticky top-0 z-10 h-16"
        >
          {/* Header left: Toggle + Breadcrumb */}
          <div className="flex items-center gap-4">
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="text-xl w-12 h-12"
              />
            ) : (
              <Button
                type="text"
                icon={
                  siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={() => setSiderCollapsed(!siderCollapsed)}
                className="text-xl w-12 h-12"
              />
            )}
          </div>

          {/* Header right: Search + Avatar */}
          <div className="flex items-center gap-2">
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
              className="flex gap-"
            >
              <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <Avatar
                  icon={<RxAvatar />}
                  size={36}
                  className="bg-gray-200 text-black"
                />
                <div className="flex flex-col leading-tight items-center justify-center">
                  <Text style={{ lineHeight: "1.2"}} className="text-sm/6 font-medium text-gray-800 capitalize">
                    {user.name || "—"}
                  </Text>
                  <Text className="text-xs text-gray-500 capitalize">
                    {user.role || "N/A"}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* <Content className="m-6 p-2 min-h-[280px] bg-white rounded-lg shadow"> */}
        <Outlet />
        {/* </Content> */}
      </Layout>
    </Layout>
  );
};

export default Home;
