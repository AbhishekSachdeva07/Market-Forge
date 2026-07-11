import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Real-Time Market Data',
    description:
      'Access live and historical market instruments through high-performance APIs designed for trading simulations and analytics.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Secure API Key Management',
    description:
      'Generate, manage, and revoke API keys with expiry controls to keep your integrations secure and organized.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Fast & Reliable',
    description:
      'Optimized with Redis caching and efficient backend services to deliver low-latency responses even under heavy workloads.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Built for Developers',
    description:
      'Simple authentication, clean REST APIs, and comprehensive tooling make integrating market data into your applications effortless.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        {/* <SitemarkIcon /> */}
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
