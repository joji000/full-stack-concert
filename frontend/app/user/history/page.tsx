'use client';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Button } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '@/lib/api';
import { useToastStore, useAuthStore } from '@/lib/store';

interface Reservation {
  id: number;
  createdAt: string;
  status: 'RESERVED' | 'CANCELLED';
  concert: {
    name: string;
  };
}

export default function UserHistory() {
  const { userId } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/reservations?userId=${userId}`);
      setReservations(res.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await api.patch(`/reservations/${id}/cancel`);
      showToast('Cancel successfully', 'success');
      fetchHistory();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel reservation';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Container maxWidth="lg">
          <Typography variant="h5" color="secondary" sx={{ mb: 3, fontWeight: 'bold' }}>
            My History
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date/Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Concert Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No reservations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{row.concert.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status === 'RESERVED' ? 'Reserved' : 'Cancelled'}
                            color={row.status === 'RESERVED' ? 'primary' : 'error'}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          {row.status === 'RESERVED' && (
                            <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(row.id)}>
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
    </Container>
  );
}