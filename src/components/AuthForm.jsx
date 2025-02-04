import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { signUp, login, logout } from "../services/authService";
import { signInWithGoogle } from "../services/firebaseConfig";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    console.log("Email Value:", email); 
    console.log("Password Value:", password);

    setLoading(true);
    try {
      const userData = isLogin
        ? await login(email, password)
        : await signUp(email, password);

      setUser(userData);
      alert(`${isLogin ? "Logged in" : "Signed up"} successfully!`);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userData = await signInWithGoogle();
      setUser(userData);
      alert("Logged in with Google successfully!");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null); 
      alert("Logged out successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      {user && <p>Welcome, {user.email}!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
      </button>
      {user && <button onClick={handleLogout}>Logout</button>}
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Loading..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default AuthForm;