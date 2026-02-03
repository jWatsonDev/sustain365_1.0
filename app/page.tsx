"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import WeeklyDashboard from "@/components/WeeklyDashboard";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      if (result.error === "NotApproved" || result.error.includes("NotApproved")) {
        setError("Your account is pending admin approval. Please check back later.");
      } else {
        setError("Invalid email or password");
      }
    } else {
      router.refresh();
    }
  };

  return (
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
          width={280}
          height={100}
          style={{ margin: "0 auto", objectFit: "contain" }}
          priority
        />
      </Box>

      <Typography variant="h5" component="h1" fontWeight={600} textAlign="center" gutterBottom>
        Sign in to Sustain365
      </Typography>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Track your daily habits and build a healthier lifestyle
      </Typography>

      {registered && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Account created. An admin must approve your account before you can sign in.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
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
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" style={{ color: "#7DBA42", fontWeight: 500 }}>
          Sign up
        </Link>
      </Typography>
    </Paper>
  );
}

function Dashboard() {
  const { data: session } = useSession();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Image src="/sustain-365-logo.png" alt="Sustain365" width={140} height={50} style={{ objectFit: "contain" }} />
          </Box>
          <Button component={Link} href="/diet" size="small" sx={{ mr: 2 }}>
            Diet Guide
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {session?.user?.name || session?.user?.email}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => signOut()}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <WeeklyDashboard />
      </Container>
    </Box>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="primary" size={48} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!session) {
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
        <LoginForm />
      </Box>
    );
  }

  return <Dashboard />;
}
