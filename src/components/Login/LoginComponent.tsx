import "./Login.css";
import { Button } from "@mui/material";
import { auth, provider } from "../../firebase";

export default function Login() {
  function login() {
    auth.signInWithRedirect(provider)
  }

  return (
      <div className="app">
        <div className="login">
          <div className="loader__container">
            <img src="./login-logo.png" alt="Logo"/>
            <div className="login__text">
              <h1>Sign in to WhatsApp</h1>
            </div>
            <Button onClick={login}>Sign in with Google</Button>
          </div>
        </div>
      </div>
  )
}
