import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 Fire Google Ads Conversion
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18073571383/53mSCIPxjJgcELegk6pD",
        value: 1.0,
        currency: "INR",
      });
    }

    // ⏳ Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 You're All Set!</h1>
        <p style={styles.text}>
          Your account has been created successfully.
        </p>
        <p style={styles.subText}>
          Redirecting you to dashboard in a few seconds...
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  title: {
    fontSize: "26px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  subText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 20px",
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ThankYou;