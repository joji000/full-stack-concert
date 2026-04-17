"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";
import StatCards from "@/components/StatCards";
import ConcertCard from "@/components/ConcertCard";
import ConcertForm from "@/components/ConcertForm";
import DeleteModal from "@/components/DeleteModal";
import api from "@/lib/api";
import { useToastStore } from "@/lib/store";

interface Concert {
  id: number;
  name: string;
  seat: number;
  description: string;
}

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [stats, setStats] = useState({
    totalSeats: 0,
    totalReserved: 0,
    totalCancelled: 0,
  });
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { showToast } = useToastStore();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, concertsRes] = await Promise.all([
        api.get("/concerts/stats"),
        api.get("/concerts"),
      ]);
      setStats(statsRes.data);
      setConcerts(concertsRes.data);
    } catch (_error) {
      console.error("Failed to fetch data:", _error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCreateConcert = async (data: {
    name: string;
    seat: number;
    description: string;
  }) => {
    try {
      await api.post("/concerts", data);
      showToast("Create successfully", "success");
      setTabIndex(0);
      fetchData();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create concert";
      showToast(errorMessage, "error");
    }
  };

  const promptDeleteConcert = (id: number, name: string) => {
    setConcertToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!concertToDelete) return;
    try {
      await api.delete(`/concerts/${concertToDelete.id}`);
      showToast("Delete successfully", "success");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create concert";
      showToast(errorMessage, "error");
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <StatCards
          totalSeats={stats.totalSeats}
          reserved={stats.totalReserved}
          cancelled={stats.totalCancelled}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Create" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tabIndex === 0 && (
              <Box>
                {concerts.length === 0 ? (
                  <Typography color="text.secondary">
                    No concerts available.
                  </Typography>
                ) : (
                  concerts.map((concert) => (
                    <ConcertCard
                      key={concert.id}
                      id={concert.id}
                      name={concert.name}
                      description={concert.description}
                      totalSeats={concert.seat}
                      role="ADMIN"
                      onDeleteClick={promptDeleteConcert}
                    />
                  ))
                )}
              </Box>
            )}

            {tabIndex === 1 && <ConcertForm onSubmit={handleCreateConcert} />}
          </>
        )}
      </Container>

      {concertToDelete && (
        <DeleteModal
          open={deleteModalOpen}
          concertName={concertToDelete.name}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
