import { Box, Button, Typography } from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";

export default function MobileBlocked() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box maxWidth={450}>
        <ComputerIcon
          sx={{
            fontSize: 80,
            color: "primary.main",
            mb: 2,
          }}
        />

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Desktop Only
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Market Data Simulator dashboard is currently available only on desktop
          devices.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Please open this website on a laptop or desktop browser for the best
          experience.
        </Typography>

        <Button
          sx={{ mt: 4 }}
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    </Box>
  );
}