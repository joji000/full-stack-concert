'use client';
import { Snackbar, Alert } from '@mui/material';
import { useToastStore } from '@/lib/store';

export default function GlobalToast() {
  const { open, message, severity, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={hideToast} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}