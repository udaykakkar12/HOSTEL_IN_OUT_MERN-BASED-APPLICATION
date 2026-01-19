import { AppstoreAddOutlined, BarChartOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

const { Sider, Header, Content, Footer } = Layout;
const items = [
    {
        key: "/app/user/dashboard",
        label: "dashboard",
        icon: <AppstoreAddOutlined />
    },

    {
        key: "/app/user/report",
        label: "report",
        icon: <BarChartOutlined />
    }
]
const Userlayout = () => {

    const navigate = useNavigate();

    const [open,setOPen] = useState(false);

    const handleNavigate=(menu)=>{
        navigate(menu.key);
    }

    const {data:session,error,isLoading} = useSWR(
        "/api/user/session",
        fetcher
    ) 

    console.log(session,error,isLoading);


    const SiderStyle={
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable'

    };

    const headerStyle={
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 0,

    }

    return (
        <Layout className="!min-h-screen">
            <Sider collapsible collapsed={open}>
                <div className="flex item-center justify-center my-4">
                    <Image
                        src="/abes1.jpeg"
                        width={75}
                        height={75}
                        alt="logo"
                        preview={false}
                        style={{ borderRadius: "50%" }}   
                        className="!text-center !mx-auto mb-3"
                    />

                </div>

                <Menu
                    defaultSelectedKeys={['/app/user/dashboard']}
                    theme="dark"
                    items={items}
                    onClick={handleNavigate}

                />

            </Sider>

            <Layout>
                <Header style={headerStyle} className="flex items-center justify-between !px-5 !bg-white !shadow">
                    <Button
                    onClick={()=>setOPen(!open)}
                    icon={<MenuOutlined />}
                    />

                    <Button
                    icon={<LogoutOutlined />}
                    />

                </Header>

                <Content>
                    <Outlet />
                </Content>
            </Layout>



        </Layout>
    )

}
export default Userlayout;