import { useState } from "react";
import AuthForm from "./components/AuthForm";
import './App.css';
import CharacterDashboard from "./components/dashboard/CharacterDashboard";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogOut = () => {
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <CharacterDashboard user={loggedInUser} onLogout={handleLogOut}/>
    );
  }

  return (
    <div className="app-container">
      <AuthForm onLoginSuccess={setLoggedInUser} />
    </div>
  );
}

export default App;