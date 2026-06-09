import { useState } from "react";
import AuthForm from "./components/AuthForm";
import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  if (loggedInUser) {
    return (
      <div className="gateway-container" style={{ textAlign: 'center' }}>
        <h2 className="gateway-title">Welcome back!</h2>
        <p style={{ color: '#72432a', fontSize: '24px' }}>Player: {loggedInUser.user_name}</p>
        <button onClick={() => setLoggedInUser(null)} className="btn-register" style={{ backgroundColor: '#a63a3a' }}>
          Log Out
        </button>
      </div>
    );
  }

  return <AuthForm onLoginSuccess={setLoggedInUser} />;
}

export default App;