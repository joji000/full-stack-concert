'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { role, setAuth } = useAuthStore();

  useEffect(() => {
    if (role === 'ADMIN') {
      router.push('/admin');
    } else if (role === 'USER') {
      router.push('/user');
    }
  }, [role, router]);

  const loginAsAdmin = () => {
    setAuth(1, 'ADMIN'); 
    router.push('/admin');
  };

  const loginAsUser = () => {
    setAuth(2, 'USER'); 
    router.push('/user');
  };

  if (role) return null; 

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 3 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Concert Reservation App</Typography>
      <Typography variant="h6" color="text.secondary">Select a role to continue</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" onClick={loginAsAdmin}>Log in as Admin</Button>
        <Button variant="outlined" size="large" onClick={loginAsUser}>Log in as User</Button>
      </Box>
    </Box>
  );
}