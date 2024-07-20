import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { supabase } from "../supabase";
import { NavLink } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await supabase.auth.signUp({ email, password });
    if (response.error) {
      console.error("Error signing up:", response.error.message);
    } else {
      console.log("Signed up successfully");
      navigate("/home")
    }
  };

  return (
    <main className={styles.signup}>
      <h1 className={styles.title}>SIGN UP</h1>
      <form className={styles.form} onSubmit={handleSignUp}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>Sign Up</button>
        </div>
      </form>
      <div className={styles.loginLink}>
        <NavLink to="/login">Already have an account? Login here</NavLink>
      </div>
    </main>
  );
}

