import React, {FC} from "react";
import classes from "./Sidebar.module.css"
import {Avatar, IconButton} from "@mui/material";
import firebase from "firebase/app";
import {ExitToApp} from "@mui/icons-material";
import {WindowSize} from "../../hooks/useWindowSize";
import {auth} from "../../firebase";

interface SidebarProps {
  user: firebase.User
  page: WindowSize
}

const Sidebar : FC<SidebarProps> = ({ user, page }) => {
  const signOut = () => {
    auth.signOut()
  }

  return (
      <div className={classes.sidebar} style={{
          minHeight: page.isMobile ? page.height : "auto"
      }}>
        <div className={classes.sidebar__header}>
          <div className={classes.header_left}>
              <Avatar src={user?.photoURL || ""} />
              <h4>{user?.displayName}</h4>
          </div>
            <div className={classes.header_right}>
                <IconButton onClick={signOut}>
                    <ExitToApp />
                </IconButton>
            </div>
        </div>
      </div>
  )
}

export default Sidebar