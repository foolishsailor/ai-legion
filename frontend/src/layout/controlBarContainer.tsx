import { ReactNode } from 'react';
import { Grid, useTheme } from '@mui/material';

export interface AgentsContainerProps {
  children?: ReactNode;
}

export const ControlBarContainer = ({ children }: AgentsContainerProps) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(30%, 1fr))',
        gap: 1,
        p: 1,
        width: 50,
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[900]
      }}
    >
      {children}
    </Grid>
  );
};
