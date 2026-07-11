import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';
import { Button } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import axios from 'axios';
import api from '../../api/api.js';

export default function Header({ onApiKeyCreated }) { 
  const createApiKey = async () => {
    try {

      const response = await api.post('/v1/api-keys');

      onApiKeyCreated();
    } catch (error) {
      const message =
        error?.response?.data?.message?.message ??
        error?.response?.data?.message ??
        error.message;

      alert(message);
    }
  };
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <Search /> */}
        {/* <CustomDatePicker /> */}
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            px: 1.5,
            py: 0.5,
            minHeight: 32,
            fontSize: "0.8rem",
          }}
          onClick={createApiKey}
        >
          Create API Key
        </Button>
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
