import { Box, Card, Typography } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface StatCardsProps {
  totalSeats: number;
  reserved: number;
  cancelled: number;
}

export default function StatCards({ totalSeats, reserved, cancelled }: StatCardsProps) {
  const cards = [
    { label: 'Total of seats', value: totalSeats, icon: <PersonOutlinedIcon fontSize="large" />, color: '#0288d1' },
    { label: 'Reserve', value: reserved, icon: <BookmarkBorderIcon fontSize="large" />, color: '#009688' },
    { label: 'Cancel', value: cancelled, icon: <HighlightOffIcon fontSize="large" />, color: '#ef5350' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
      {cards.map((card, idx) => (
        <Card
          key={idx}
          sx={{
            flex: 1,
            bgcolor: card.color,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            boxShadow: 'none',
          }}
        >
          {card.icon}
          <Typography variant="body2" sx={{ mt: 1, mb: 1, opacity: 0.9 }}>
            {card.label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: '500' }}>
            {card.value}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}