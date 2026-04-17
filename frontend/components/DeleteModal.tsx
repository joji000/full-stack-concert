'use client';
import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface DeleteModalProps {
  open: boolean;
  concertName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ open, concertName, onClose, onConfirm }: DeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { p: 2, borderRadius: 3, maxWidth: 400, textAlign: 'center' } } }}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CancelIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Are you sure to delete?
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          &quot;{concertName}&quot;
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} sx={{ minWidth: 120 }}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} sx={{ minWidth: 120 }}>
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}