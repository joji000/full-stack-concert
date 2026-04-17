'use client';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import ReservationTable, { Reservation } from '@/components/ReservationTable';
import api from '@/lib/api';
import { useToastStore } from '@/lib/store';

export default function AdminHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations/all');
      setReservations(res.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
        History
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
        <ReservationTable reservations={reservations} showUser />
      )}
    </Container>
  );
}