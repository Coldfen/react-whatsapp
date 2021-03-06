import React from 'react';
import './App.css';
import useWindowSize from "./hooks/useWindowSize";
import Login from "./components/Login/LoginComponent"
import useAuthUser from "./hooks/useAuthUser";
import Sidebar from "./components/Sidebar/SidebarComponent";
import {Redirect, Route} from "react-router-dom"
import Chat from "./components/Chat/ChatComponent";


function App() {
  const page = useWindowSize()
  const user = useAuthUser()

  if(!user) {
    return <Login />
  }
  return (
    <div className="app" style={{ ...page }}>
        <Redirect to={page.isMobile ? "/chats" : "/" } />
       <div className="app__body">
         <Sidebar user={user} page={page} />
         <Route path="/room/:roomId">
           <Chat user={user} page={page} />
         </Route>
       </div>
    </div>
  );

}

export default App;
