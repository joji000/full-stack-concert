"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (role !== "USER") {
      router.push("/");
    }
  }, [isClient, role, router]);

  if (!isClient || role !== "USER") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>{children}</Box>
    </Box>
  );
}
