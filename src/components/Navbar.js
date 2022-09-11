import "antd/dist/antd.min.css";
import "./Navbar.css"
import {
  MessageOutlined,
  TwitterOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,

} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Route, Routes } from "react-router-dom";
import { useDetails } from "../store/user";
import { Home } from "./Home";
import { Search } from "./Search";
import { Profile } from "./Profile";
import React from "react";
import { NavLink } from "react-router-dom";
import Login from "./Login";
import { Tweet } from "./Tweet";
import {Signup} from "./Signup"
import { Protected } from "./Protected";
const { Header, Content, Footer, Sider } = Layout;
const AntLink = () => (
  <>
  <TwitterOutlined
    style={{ fontSize: "25px", color: "#1DA1F2" }}
  />
   <TwitterOutlined
    style={{ fontSize: "25px", transform:"scaleX(-1)",color: "#1DA1F2" }}
  />
  </>
);

export const Navbar = () => {
  

   
  const [userData, setuserData] = useDetails();
  return (
    <Layout hasSider>
      <Sider 
        style={{
          margin:"auto",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          borderRight:"1px solid rgb(209 204 204)"
          
          
        }}
      >
        <div className="logo" />
        <Menu   mode="inline" style={{ paddingTop: "30px"}}>
          {[
            ["/Home", " ", AntLink],
            ["/Home", "Home", HomeOutlined],
            ["/search", "Search", SearchOutlined],
            [`/profile/${userData.email}`, "Profile", UserOutlined],
            ["/compose/tweet", "Tweet", MessageOutlined],
          ].map((navItem, idx) => (
            <Menu.Item key={idx} icon={React.createElement(navItem[2])}>
              <NavLink className="sidebar-text" to={navItem[0]}>{navItem[1]}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
          backgroundColor: "white",
        }}
      >
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
        </Header>
        <Content
          style={{
      
            overflow: "initial",
            backgroundColor: "white",
          }}
        >
          {/* <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/compose/tweet" element={<Tweet />} />
            <Route path="/profile/:user_email" element={<Profile/>} />
            <Route path="/signup" element={<Signup />} />
          </Routes> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Protected><Home /></Protected>} />
            <Route path="/search" element={<Protected><Search /></Protected>} />
            <Route path="/compose/tweet" element={<Protected><Tweet /></Protected>} />
            <Route path="/profile" element={<Protected><Profile/></Protected>} />
            <Route path="/profile/:user_email" element={<Protected><Profile/></Protected>} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "white",
          }}
        ><TwitterOutlined /> Twitter  ©2022 Created by <span style={{fontWeight:"bolder"}}>Rithish Reddy</span></Footer>
      </Layout>
    </Layout>
  );
};
