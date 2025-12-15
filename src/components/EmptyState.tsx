import { Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 4,
        p: 6,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack spacing={2} alignItems='center'>
        {icon}
        <Typography variant='h6'>{title}</Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ maxWidth: 420 }}
        >
          {description}
        </Typography>
        {actionLabel && (
          <Button variant='contained' onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
