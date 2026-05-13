// App.jsx
import { useState } from "react";
import Home from "./home";
import LoginModal from "./Login.jsx";
import Dash from "./dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (loggedInUser) => {
    console.log('Login successful, user:', loggedInUser);
    setUser(loggedInUser);
    setShowLogin(false);
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <Dash user={user} />;
  }

  return (
    <div>
      <Home 
        user={user} 
        onLoginClick={handleOpenLogin} 
        onLogout={handleLogout}
      />
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
}

export default App;