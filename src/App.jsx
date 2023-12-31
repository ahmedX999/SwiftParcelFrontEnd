import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import Parcels from './components/Parcels';
import ParcelManagement from './components/ParcelManagement';
import Temp from './components/Temp';
import Login from './components/Login';
import Register from './components/Register';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [activeContent, setActiveContent] = useState(null);
 

  const handleMenuItemClick = (contentComponent) => {
    setActiveContent(() => contentComponent);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={80} theme="light">
        

        <Menu mode="vertical" theme="light"    >
          <Menu.Item
            key="1"
            title="Parcel Management"
            label="Parcel Management"
            icon={<DesktopOutlined />}
            onClick={() => handleMenuItemClick(ParcelManagement)} // Example: No component for key 1
          />
          <Menu.Item
            key="2"
            icon={<PieChartOutlined />}
            onClick={() => handleMenuItemClick(Parcels)}
          />
          <Menu.Item
            key="3"
            icon={<FileOutlined />}
            onClick={() => handleMenuItemClick(Temp)} // Example: No component for key 3
          />
          <Menu.Item
            key="4"
            icon={<LoginOutlined />}
            onClick={() => handleMenuItemClick(Login)} // Example: No component for key 3
          />
           <Menu.Item
            key="5"
            icon={<UserAddOutlined />}
            onClick={() => handleMenuItemClick(Register)} // Example: No component for key 3
          />
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          {activeContent && React.createElement(activeContent)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
