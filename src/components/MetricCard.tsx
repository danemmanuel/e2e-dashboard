import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  helperText?: string;
  icon?: ReactNode;
}

export function MetricCard({
  label,
  value,
  helperText,
  icon,
}: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction='row' spacing={2} alignItems='center'>
          {icon}
          <Stack spacing={0.5}>
            <Typography variant='body2' color='text.secondary'>
              {label}
            </Typography>
            <Typography variant='h5'>{value}</Typography>
            {helperText && (
              <Typography variant='caption' color='text.secondary'>
                {helperText}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
