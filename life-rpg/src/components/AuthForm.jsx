import { useState } from "react";
import { authenticateUser } from "../services/authService";

function AuthForm({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [user_name, setUser_name] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? 'login' : 'register';

    try {
      const data = await authenticateUser(endpoint, user_name, password);

      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        setUser_name('');
        setPassword('');

        if (isLoginMode) {
          onLoginSuccess(data.user); // Hand the verified player data back up to App.jsx
        } else {
          setIsLoginMode(true); // Automatically slide registered players to login screen
        }
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to the server");
    }
  };

  return (
    <div className="gateway-container">
      <h2 className="gateway-title">
        {isLoginMode ? "Life RPG Login" : "Life RPG Register"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User Name:</label>
          <input 
            type="text" 
            value={user_name} 
            onChange={(e) => setUser_name(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn-register">
          {isLoginMode ? "Sign In" : "Register New Account"}
        </button>
      </form>

      <div className="toggle-text">
        {isLoginMode ? (
          <span onClick={() => {
            setIsLoginMode(false);
            setUser_name('');
            setPassword('');
          }}>Don't have an account? Register here</span>
        ) : (  
          <span onClick={() => {
            setIsLoginMode(true);
            setUser_name('');
            setPassword('');
          }}>Already have an account? Sign in here</span>
        )}
      </div>
    </div>
  );
}

export default AuthForm;