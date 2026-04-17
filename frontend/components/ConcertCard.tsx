'use client';
import { Card, Typography, Box, Button, Divider } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface ConcertCardProps {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  role: 'ADMIN' | 'USER' | null;
  onDeleteClick?: (id: number, name: string) => void;
  onReserveClick?: (id: number) => void;
}

export default function ConcertCard({
  id,
  name,
  description,
  totalSeats,
  role,
  onDeleteClick,
  onReserveClick,
}: ConcertCardProps) {
  return (
    <Card sx={{ mb: 2, p: 3 }}>
      <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
        {name}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <PersonOutlinedIcon />
          <Typography>{totalSeats}</Typography>
        </Box>

        {role === 'ADMIN' && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDeleteClick && onDeleteClick(id, name)}
          >
            Delete
          </Button>
        )}

        {role === 'USER' && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BookmarkBorderIcon />}
            onClick={() => onReserveClick && onReserveClick(id)}
          >
            Reserve
          </Button>
        )}
      </Box>
    </Card>
  );
}