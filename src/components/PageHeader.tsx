import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map((crumb) =>
            crumb.href ? (
              <Link
                key={crumb.label}
                component={RouterLink}
                to={crumb.href}
                underline='hover'
                color='text.secondary'
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.label} color='text.primary'>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'center' }}
        justifyContent='space-between'
      >
        <div>
          <Typography variant='h4'>{title}</Typography>
          {subtitle && (
            <Typography variant='body1' color='text.secondary'>
              {subtitle}
            </Typography>
          )}
        </div>
        {actions}
      </Stack>
    </Stack>
  );
}
