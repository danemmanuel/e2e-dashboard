import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useDashboardFilters } from '../providers/DashboardFilters.tsx';

const OPTIONS = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
];

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useDashboardFilters();

  return (
    <ToggleButtonGroup
      size='small'
      value={timeRange}
      exclusive
      onChange={(_, value) => value && setTimeRange(value)}
      sx={{ backgroundColor: 'background.paper', borderRadius: 3 }}
    >
      {OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value} sx={{ px: 2 }}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
