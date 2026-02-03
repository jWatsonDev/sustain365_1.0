"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/?registered=true");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image
            src="/sustain-365-logo.png"
            alt="Sustain365"
            width={120}
            height={120}
            style={{ margin: "0 auto" }}
            priority
          />
        </Box>

        <Typography variant="h5" component="h1" fontWeight={600} textAlign="center" gutterBottom>
          Create an account
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Join Sustain365 and start tracking your habits
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            slotProps={{ htmlInput: { minLength: 8 } }}
            helperText="At least 8 characters"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign up"}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link href="/" style={{ color: "#7DBA42", fontWeight: 500 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
