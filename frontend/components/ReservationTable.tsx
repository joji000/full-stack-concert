'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

export interface Reservation {
  id: number;
  user?: { username: string };
  concert: { id: number; name: string };
  status: 'RESERVED' | 'CANCELLED';
  createdAt: string;
}

interface ReservationTableProps {
  reservations: Reservation[];
  showUser?: boolean;
}

export default function ReservationTable({ reservations, showUser = false }: ReservationTableProps) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Date/Time</TableCell>
            {showUser && <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>}
            <TableCell sx={{ fontWeight: 'bold' }}>Concert Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showUser ? 4 : 3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                No reservations found.
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                {showUser && <TableCell>{row.user?.username || '-'}</TableCell>}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}