import React from 'react';
import './App.css';
import useWindowSize from "./hooks/useWindowSize";
import Login from "./components/Login/LoginComponent"
import useAuthUser from "./hooks/useAuthUser";
import Sidebar from "./components/Sidebar/SidebarComponent";
import {Route, Routes} from "react-router-dom";
import Chat from "./components/Chat/ChatComponent";

function App() {
  const page = useWindowSize()
  const user = useAuthUser()

  if(!user) {
    return <Login />
  }
  return (
    <div className="app" style={{ ...page }}>
       <div className="app__body">
         <Sidebar user={user} page={page} />
         <Routes>
           <Route path="/room/:roomId" element={ <Chat user={user} page={page}/> } />
         </Routes>
       </div>
    </div>
  );

}

export default App;
