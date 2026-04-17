'use client';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const DRAWER_WIDTH = 240;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setAuth, logout } = useAuthStore();

  const handleSwitchRole = () => {

    if (role === 'ADMIN') {
      setAuth(2, 'USER');
      router.push('/user');
    } else {
      setAuth(1, 'ADMIN');
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const basePath = role === 'ADMIN' ? '/admin' : '/user';

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: basePath },
    { text: 'History', icon: <HistoryIcon />, path: `${basePath}/history` },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {role === 'ADMIN' ? 'Admin' : 'User'}
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <ListItem disablePadding key={item.text} sx={{ mb: 1 }}>
              <ListItemButton
                selected={active}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: '8px',
                  bgcolor: active ? 'primary.light' : 'transparent',
                  color: active ? 'primary.dark' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.light' : 'action.hover',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    '&:hover': {
                      bgcolor: '#e3f2fd',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: active ? '#1976d2' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} slotProps={{ primary: { sx: { fontWeight: active ? 600 : 400 } } }} />
              </ListItemButton>
            </ListItem>
          );
        })}

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton onClick={handleSwitchRole} sx={{ borderRadius: '8px' }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary={`Switch to ${role === 'ADMIN' ? 'user' : 'admin'}`} />
          </ListItemButton>
        </ListItem>
      </List>

      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px' }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}