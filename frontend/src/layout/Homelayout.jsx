import { Layout, theme } from "antd";
const { Header, Content } = Layout;

const Homelayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    return (
        <Layout>
            <Header className="!bg-[] flex items-center justify-center">
                <h1 className='text-white text-lg md:text-3xl font-bold text-center'>
                    WELCOME TO ABES HOSTEL TRACKER
                </h1>

            </Header>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,

                }}

            >   {children}
            </Content>
        </Layout>

    )
}
export default Homelayout;