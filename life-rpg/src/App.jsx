import { useState } from "react";
import AuthForm from "./components/AuthForm";
import './App.css';
import CharacterDashboard from "./components/dashboard/CharacterDashboard";
import Notification from "./components/Notification";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const triggerNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type}]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const handleLogOut = () => {
    setLoggedInUser(null);
    triggerNotification("Logged out safely. See you tomorrow, Adventurer!", "info");
  };

  return (
    <div className="app-container">
      {loggedInUser ? (
        <CharacterDashboard 
          user={loggedInUser} 
          onLogout={handleLogOut} 
          notify={triggerNotification}/>
      ) : (
        <AuthForm onLoginSuccess={(user) => {
          setLoggedInUser(user);
          triggerNotification(`Welcome back, ${user.user_name}!`, "success");
        }}
        notify={triggerNotification} 
        />
      )}
      <div className="notification-container">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
      
    </div>
  );
}

export default App;