import React, {FC, MouseEventHandler, ReactNode, useState} from "react";
import {Avatar, IconButton} from "@mui/material";
import firebase from "firebase/app";
import {Add, ExitToApp, Home, Message, PeopleAlt, SearchOutlined} from "@mui/icons-material";
import {WindowSize} from "../../hooks/useWindowSize";
import {auth, createTimestamp, db} from "../../firebase";
import {NavLink, Route, Switch} from "react-router-dom";
import "./Sidebar.css"
import SidebarList from "./SidebarList/SidebarListComponent";

interface SidebarProps {
  user: firebase.User
  page: WindowSize
}

interface NavProps {
    activeClass: boolean
    onClick: MouseEventHandler
    children: ReactNode
}

const Sidebar : FC<SidebarProps> = ({ user, page }) => {
    const [ menu, setMenu ] = useState(1)

    const signOut = () => {
    auth.signOut()
  }

  function createRoom() {

       const roomName = prompt("Type the name of your room")
      if(roomName?.trim()) {
          db.collection('rooms').add({
              name: roomName,
              timestamp: createTimestamp()
          })
      }
  }

  let Nav;
  if(page.isMobile) {
      Nav = NavLink
  } else {
      Nav = (props: NavProps) => (
          <div
              className={`${props.activeClass ? "sidebar__menu--selected" : ""}`}
              onClick={props.onClick}
          >
              { props.children }
          </div>
      )
  }

  return (
      <div className="sidebar" style={{
          minHeight: page.isMobile ? page.height : "auto"
      }}>
        <div className="sidebar__header">
          <div className="sidebar__header--left">
              <Avatar src={user?.photoURL || ""} />
              <h4>{user?.displayName}</h4>
          </div>
            <div className="sidebar__header--right">
                <IconButton onClick={signOut}>
                    <ExitToApp />
                </IconButton>
            </div>
        </div>
          <div className="sidebar__search">
              <form className="sidebar__search--container">
                    <SearchOutlined />
                    <input
                        placeholder="Search for users or rooms"
                        type="text"
                        id="search"
                    />
              </form>
          </div>

          <div className="sidebar__menu">
            <Nav
                to="/chats"
                activeClassName="sidebar__menu--selected"
                onClick={() => setMenu(1)}
                activeClass={menu === 1}
            >
                <div className="sidebar__menu--home">
                    <Home />
                    <div className="sidebar__menu--line" />
                </div>
            </Nav>
              
              <Nav
                  to="/rooms"
                  activeClassName="sidebar__menu--selected"
                  onClick={() => setMenu(2)}
                  activeClass={menu === 2}
              >
                  <div className="sidebar__menu--rooms">
                      <Message />
                      <div className="sidebar__menu--line" />
                  </div>
              </Nav>

              <Nav
                  to="/users"
                  activeClassName="sidebar__menu--selected"
                  onClick={() => setMenu(3)}
                  activeClass={menu === 3}
              >
                  <div className="sidebar__menu--users">
                      <PeopleAlt />
                      <div className="sidebar__menu--line" />
                  </div>
              </Nav>
          </div>
          {page.isMobile ? (
              <Switch>
                  <Route path="/chats">
                      <SidebarList />
                  </Route>
                  <Route path="/rooms">
                      <SidebarList />
                  </Route>
                  <Route path="/users">
                      <SidebarList />
                  </Route>
                  <Route path="/search">
                      <SidebarList />
                  </Route>
              </Switch>
          ) : menu === 1 ? (
              <SidebarList />
          ) : menu === 2 ? (
              <SidebarList />
          ) : menu === 3 ? (
              <SidebarList />
              ): menu === 4 ? (
              <SidebarList />
          ) : null}
          <div className="sidebar__chat--addRoom">
              <IconButton onClick={createRoom}>
                  <Add />
              </IconButton>
          </div>
      </div>
  )
}

export default Sidebar