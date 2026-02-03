"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ALLOWED = [
  "Consume at least 150g of protein daily",
  "Eat fruit every day",
  "Eat vegetables every day",
  "Protein bars and protein ice cream are allowed",
];

const NOT_ALLOWED = [
  "No regular soda",
  "No chips, fries, or deep-fried foods",
  "No sweets",
  "No regular pizza",
];

export default function DietPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Image src="/sustain-365-logo.png" alt="Sustain365" width={140} height={50} style={{ objectFit: "contain" }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Diet Guidelines
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Follow these guidelines to stay on track. You have flexibility in what you eat,
            as long as you stick to these rules.
          </Typography>

          <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 2 }}>
            Do This
          </Typography>
          <List dense>
            {ALLOWED.map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 2 }}>
            Avoid
          </Typography>
          <List dense>
            {NOT_ALLOWED.map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={item.replace("No ", "")}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "warning.light",
              borderRadius: 2,
              opacity: 0.7,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              Remember: You get 1 cheat day per week where these rules don&apos;t apply,
              plus unlimited cheat meals throughout the week.
            </Typography>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
}
