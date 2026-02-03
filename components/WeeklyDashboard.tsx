"use client";

import { useState, useEffect, useCallback } from "react";
import { HABITS, DAY_NAMES, isToday, isFutureDay, parseLocalDate } from "@/lib/habits";
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

interface HabitCompletion {
  id: string;
  habit: string;
  completed: boolean;
}

interface Day {
  id: string;
  date: string;
  dayOfWeek: number;
  isCheatDay: boolean;
  isCheatMeal: boolean;
  habits: HabitCompletion[];
}

interface Week {
  id: string;
  weekStartDate: string;
  days: Day[];
}

export default function WeeklyDashboard() {
  const [week, setWeek] = useState<Week | null>(null);
  const [weekStartDate, setWeekStartDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeek = useCallback(async () => {
    try {
      const res = await fetch("/api/weeks");
      const data = await res.json();
      setWeek(data.week);
      setWeekStartDate(data.weekStartDate);
    } catch {
      setError("Failed to load week");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeek();
  }, [fetchWeek]);

  const createWeek = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weeks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setWeek(data.week);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to create week");
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId: string, completed: boolean) => {
    try {
      await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      setWeek((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          days: prev.days.map((day) => ({
            ...day,
            habits: day.habits.map((h) =>
              h.id === habitId ? { ...h, completed } : h
            ),
          })),
        };
      });
    } catch {
      setError("Failed to update habit");
    }
  };

  const toggleCheatDay = async (dayId: string, isCheatDay: boolean) => {
    try {
      await fetch(`/api/days/${dayId}/cheat-day`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCheatDay }),
      });
      setWeek((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          days: prev.days.map((day) => ({
            ...day,
            isCheatDay: day.id === dayId ? isCheatDay : isCheatDay ? false : day.isCheatDay,
          })),
        };
      });
    } catch {
      setError("Failed to update cheat day");
    }
  };

  const toggleCheatMeal = async (dayId: string, isCheatMeal: boolean) => {
    try {
      await fetch(`/api/days/${dayId}/cheat-meal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCheatMeal }),
      });
      setWeek((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          days: prev.days.map((day) => ({
            ...day,
            isCheatMeal: day.id === dayId ? isCheatMeal : day.isCheatMeal,
          })),
        };
      });
    } catch {
      setError("Failed to update cheat meal");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!week) {
    return (
      <Paper elevation={0} sx={{ textAlign: "center", p: 6, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          No week started yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start your Sustain365 challenge for the week of {weekStartDate}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={createWeek}
          sx={{ px: 4, py: 1.5 }}
        >
          Start This Week
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    );
  }

  const hasCheatDay = week.days.some((d) => d.isCheatDay);

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Week Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h5" fontWeight={700}>
          Week of {parseLocalDate(week.weekStartDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </Typography>
      </Paper>

      {/* Habits Grid */}
      <TableContainer component={Paper} elevation={0} sx={{ mb: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 180 }}>Habit</TableCell>
              {week.days.map((day, i) => {
                const date = parseLocalDate(day.date);
                const today = isToday(date);
                return (
                  <TableCell
                    key={day.id}
                    align="center"
                    sx={{
                      minWidth: 70,
                      bgcolor: today ? "primary.main" : day.isCheatDay ? "warning.light" : "transparent",
                      color: today ? "white" : "inherit",
                    }}
                  >
                    <Typography variant="caption" fontWeight={today ? 700 : 500} display="block">
                      {DAY_NAMES[i]}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: today ? 1 : 0.7 }}>
                      {date.getDate()}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {HABITS.map((habit) => (
              <TableRow key={habit.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography fontSize="1.2rem">{habit.icon}</Typography>
                    <Typography variant="body2" fontWeight={500}>{habit.label}</Typography>
                  </Box>
                </TableCell>
                {week.days.map((day) => {
                  const habitCompletion = day.habits.find((h) => h.habit === habit.id);
                  const date = parseLocalDate(day.date);
                  const today = isToday(date);
                  const future = isFutureDay(date);
                  return (
                    <TableCell
                      key={day.id}
                      align="center"
                      sx={{
                        bgcolor: today ? "rgba(125,186,66,0.15)" : day.isCheatDay ? "rgba(255,193,7,0.15)" : "transparent",
                      }}
                    >
                      {habitCompletion && (
                        <Checkbox
                          checked={habitCompletion.completed}
                          onChange={(e) => toggleHabit(habitCompletion.id, e.target.checked)}
                          disabled={future}
                          size="small"
                          sx={{
                            color: "grey.400",
                            "&.Mui-checked": { color: "primary.main" },
                            "&.Mui-disabled": { opacity: 0.3 },
                          }}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {/* Cheat Day Row */}
            <TableRow sx={{ bgcolor: "rgba(255,193,7,0.08)" }}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography fontSize="1.2rem">🍕</Typography>
                  <Typography variant="body2" fontWeight={600}>Cheat Day</Typography>
                  <Chip label="1 per week" size="small" color="warning" variant="outlined" />
                </Box>
              </TableCell>
              {week.days.map((day) => {
                const date = parseLocalDate(day.date);
                const today = isToday(date);
                const future = isFutureDay(date);
                return (
                  <TableCell
                    key={day.id}
                    align="center"
                    sx={{
                      bgcolor: today ? "rgba(125,186,66,0.15)" : day.isCheatDay ? "rgba(255,193,7,0.3)" : "transparent",
                    }}
                  >
                    <Checkbox
                      checked={day.isCheatDay}
                      onChange={(e) => toggleCheatDay(day.id, e.target.checked)}
                      disabled={future || (hasCheatDay && !day.isCheatDay)}
                      size="small"
                      sx={{
                        color: "grey.400",
                        "&.Mui-checked": { color: "warning.dark" },
                        "&.Mui-disabled": { opacity: 0.3 },
                      }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
            {/* Cheat Meal Row */}
            <TableRow sx={{ bgcolor: "rgba(255,152,0,0.08)" }}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography fontSize="1.2rem">🍔</Typography>
                  <Typography variant="body2" fontWeight={600}>Cheat Meal</Typography>
                </Box>
              </TableCell>
              {week.days.map((day) => {
                const date = parseLocalDate(day.date);
                const today = isToday(date);
                const future = isFutureDay(date);
                return (
                  <TableCell
                    key={day.id}
                    align="center"
                    sx={{
                      bgcolor: today ? "rgba(125,186,66,0.15)" : day.isCheatMeal ? "rgba(255,152,0,0.3)" : "transparent",
                    }}
                  >
                    <Checkbox
                      checked={day.isCheatMeal}
                      onChange={(e) => toggleCheatMeal(day.id, e.target.checked)}
                      disabled={future}
                      size="small"
                      sx={{
                        color: "grey.400",
                        "&.Mui-checked": { color: "warning.dark" },
                        "&.Mui-disabled": { opacity: 0.3 },
                      }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Progress Summary */}
      <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Weekly Progress
          </Typography>
          <Grid container spacing={3}>
            {HABITS.map((habit) => {
              const completed = week.days.filter((d) =>
                d.habits.find((h) => h.habit === habit.id && h.completed)
              ).length;
              const percentage = Math.round((completed / 7) * 100);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={habit.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography fontSize="1.5rem">{habit.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {habit.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {completed}/7
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: percentage === 100 ? "success.main" : "primary.main",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
