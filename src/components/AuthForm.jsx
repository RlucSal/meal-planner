import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { signUp, login, logout } from "../services/authService";
import { signInWithGoogle } from "../services/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Name for manual sign up
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    console.log("Email Value:", email); 
    console.log("Password Value:", password);
    console.log("Name Value:", name); // For manual sign up

    setLoading(true);
    try {
      const userData = isLogin
        ? await login(email, password)
        : await signUp(email, password);

      setUser(userData);
      alert(`${isLogin ? "Logged in" : "Signed up"} successfully!`);
      navigate("/home");

      // Store user data in Firestore after successful manual sign up
      await storeUserData(userData, name);
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

      // Store user data in Firestore after Google sign-in
      const { displayName, email, uid } = userData;
      await storeUserData(userData, displayName); // Store name from Google

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

  // Unified function to store user data (whether from Google or manual signup)
  const storeUserData = async (userData, name) => {
    const db = getFirestore(); 
    const { email, uid } = userData;

    // Add user data to Firestore
    await setDoc(doc(db, "users", uid), {
      name: name || userData.displayName, 
      email: email,
    });
  };

  return (
    <div className="sign-page">
      <h6 className="hero1">Welcome to</h6>
      <h1 className="hero2">mymeal</h1>
      <div className="container-form">
        <h2 className="title">{isLogin ? "Login" : "Sign Up"}</h2>
        {user && <p>Welcome, {user.email}!</p>}
        <form className="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                className="imput-form"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}
          <input
            className="imput-form"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className="imput-form"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button-submit" type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
          
          <button className="sets-login-signup" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
          {user && <button className="log-out" onClick={handleLogout}>Logout</button>}
          <button className="google" onClick={handleGoogleSignIn} disabled={loading}>
            {loading ? "Loading..." : "Sign in with Google"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
