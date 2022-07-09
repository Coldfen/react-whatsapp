import React, {FC} from "react";
import classes from "./Chat.module.css"
import firebase from "firebase";
import {WindowSize} from "../../hooks/useWindowSize";

interface ChatProps {
  user: firebase.User
  page: WindowSize
}

const Chat: FC<ChatProps> = ({user, page}) => {
  return <div className="chat">Chat</div>;
}


export default Chat