import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData.jsx';
import { Box, Typography } from "@mui/material";

export default function CustomizedDataGrid() {
  const rowData = [];

  function NoApiKeysOverlay() {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6">No API Keys</Typography>
        <Typography variant="body2" color="text.secondary">
          Issue an API key to start using Market Data Simulator.
        </Typography>
      </Box>
    );
  }

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={rowData}
      columns={columns}
      slots={{
        noRowsOverlay: NoApiKeysOverlay,
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
