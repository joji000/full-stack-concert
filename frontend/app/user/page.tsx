'use client';
import { useEffect, useState } from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import ConcertCard from '@/components/ConcertCard';
import api from '@/lib/api';
import { useToastStore, useAuthStore } from '@/lib/store';

interface Concert {
  id: number;
  name: string;
  description: string;
  availableSeats: number;
}

export default function UserDashboard() {
  const { userId } = useAuthStore();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchConcerts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/concerts');
      setConcerts(res.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load concerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (concertId: number) => {
    try {
      await api.post('/reservations', { userId, concertId });
      showToast('Reserve successfully', 'success');
      fetchConcerts(); 
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reserve seat';
      showToast(message, 'error');
    }
  };

  return (
    <Container maxWidth="lg">
          <Typography variant="h5" color="secondary" sx={{ mb: 3, fontWeight: 'bold' }}>
            Available Concerts
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
          ) : (
            <Box>
              {concerts.length === 0 ? (
                <Typography color="text.secondary">No concerts available.</Typography>
              ) : (
                concerts.map(concert => (
                  <ConcertCard
                    key={concert.id}
                    id={concert.id}
                    name={concert.name}
                    description={concert.description}
                    totalSeats={concert.availableSeats} 
                    role="USER"
                    onReserveClick={handleReserve}
                  />
                ))
              )}
            </Box>
          )}

    </Container>
  );
}