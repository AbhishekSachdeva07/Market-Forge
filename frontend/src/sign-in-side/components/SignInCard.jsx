import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Fade,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SitemarkIcon } from "./CustomIcons";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 460,
  minHeight: 560,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  borderRadius: 18,
  boxShadow:
    "0 8px 30px rgba(0,0,0,.08)",
}));

export default function SignInCard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [newUser, setNewUser] = useState(false);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);

  const [emailError, setEmailError] = useState("");

  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const jwt = localStorage.getItem("SIM-USER-JWT");
    const email = localStorage.getItem("SIM-USER-EMAIL");
    const name = localStorage.getItem("SIM-USER-NAME");

    if (jwt && email && name) {
      navigate(`/dashboard/${encodeURIComponent(email)}`, { replace: true });
    }
  }, [navigate]);

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async () => {
    const verified = await verifyOtp();

    console.log(verified)

    if (!verified) return;

    if (newUser) {
      await createAccount();
    }
  };

  const validateEmail = () => {
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const sendOtp = async () => {
    if (!validateEmail()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/login/otp`,
        {
          email
        }
      );

      setOtpSent(true);

      setTimer(200);

      setNewUser(
        response.data.type === 'signup'
      );
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/register`,
        {
          name: name.trim(),
          email,
        }
      );

      if(response.status>201){
        alert(response.data.message);
        return;
      }

      const data = response.data;

      // Save user info
      localStorage.setItem("SIM-USER-EMAIL", data.savedUser.email);
      localStorage.setItem("SIM-USER-NAME", data.savedUser.name);
      localStorage.setItem("SIM-USER-JWT", data.jwt);

      navigate(`/dashboard/${encodeURIComponent(email)}`);
    } catch (e) {
      alert(
        e?.response?.data?.message || "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Enter 6 digit OTP");
      return;
    }

    setOtpError("");

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/verify/otp`,
        {
          email,
          otp,
          type: newUser?"signup":"login"
        }
      );

      const data = response.data;

      console.log(data);

      if(!data?.success){
        alert("Invalid OTP");
        return;
      }

      localStorage.setItem(
        "SIM-USER-JWT",
        data.jwtToken
      );

      localStorage.setItem(
        "SIM-USER-EMAIL",
        email
      );

      if (data?.name)
        localStorage.setItem(
          "SIM-USER-NAME",
          data?.name
        );

      if(!newUser){
        navigate(`/dashboard/${encodeURIComponent(email)}`);
      }
      return true;
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          "Invalid OTP"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  return (
  <StyledCard variant="outlined">
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <SitemarkIcon />
    </Box>

    <Typography
      variant="h4"
      fontWeight={700}
      sx={{ textAlign: "center" }}
    >
      Welcome 👋
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ textAlign: "center", mb: 2 }}
    >
      Sign in or create your account using your email.
    </Typography>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Email */}

      <FormControl>
        <FormLabel>Email Address</FormLabel>

        <TextField
          fullWidth
          type="email"
          placeholder="john@example.com"
          value={email}
          error={Boolean(emailError)}
          helperText={emailError}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Send OTP */}

      {!otpSent && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          onClick={sendOtp}
          sx={{
            mt: 1,
            py: 1.4,
            borderRadius: 3,
          }}
        >
          {loading ? (
            <CircularProgress
              size={22}
              color="inherit"
            />
          ) : (
            "Send OTP"
          )}
        </Button>
      )}

      {/* OTP Section */}

      <Fade in={otpSent}>
        <Box
          sx={{
            display: otpSent ? "flex" : "none",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>One Time Password</FormLabel>

            <TextField
              fullWidth
              placeholder="Enter 6 digit OTP"
              value={otp}
              error={Boolean(otpError)}
              helperText={otpError}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />
          </FormControl>

          {/* Name */}

          {newUser && (
            <FormControl>
              <FormLabel>Full Name</FormLabel>

              <TextField
                fullWidth
                placeholder="John Doe"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </FormControl>
          )}

          {/* Verify */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              py: 1.4,
              borderRadius: 3,
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : newUser ? (
              "Create Account"
            ) : (
              "Verify OTP"
            )}
          </Button>

          {/* Resend */}

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
          >
            {timer > 0 ? (
              <>
                Resend OTP in{" "}
                <strong>{timer}s</strong>
              </>
            ) : (
              <Link
                component="button"
                underline="hover"
                onClick={sendOtp}
              >
                Resend OTP
              </Link>
            )}
          </Typography>
        </Box>
      </Fade>
    </Box>

    <Box sx={{ flexGrow: 1 }} />

    <Typography
      variant="caption"
      align="center"
      color="text.secondary"
      sx={{ mt: 3 }}
    >
      By continuing you agree to our Terms of Service and Privacy Policy.
    </Typography>
  </StyledCard>
)}