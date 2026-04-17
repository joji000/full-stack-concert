'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface ConcertFormProps {
  onSubmit: (data: { name: string; seat: number; description: string }) => void;
}

export default function ConcertForm({ onSubmit }: ConcertFormProps) {
  const [name, setName] = useState('');
  const [seat, setSeat] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<{name?: string; seat?: string; description?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Concert Name is required';
    if (!seat) newErrors.seat = 'Total of seat is required';
    if (!description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ name, seat: Number(seat), description });

    setName('');
    setSeat('');
    setDescription('');
  };

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
        Create
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Concert Name"
              placeholder="Please input concert name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Total of seat"
              type="number"
              placeholder="500"
              value={seat}
              onChange={(e) => setSeat(e.target.value ? Number(e.target.value) : '')}
              error={!!errors.seat}
              helperText={errors.seat}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              placeholder="Please input description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} size="large">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}