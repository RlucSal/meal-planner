import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { signUp, login, logout } from "../services/authService";
import { signInWithGoogle } from "../services/firebaseConfig";

const AuthForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = isLogin
        ? await login(email, password)
        : await signUp(name, address, email, password);
      setUser(userData);
      alert(`${isLogin ? "Logged in" : "Signed up"} successfully!`);
      navigate("/home"); 
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userData = await signInWithGoogle();
      setUser(userData);
      alert("Logged in with Google successfully!");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      {user && <p>Welcome, {user.email}!</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
      </button>
      {user && <button onClick={logout}>Logout</button>}
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default AuthForm;

