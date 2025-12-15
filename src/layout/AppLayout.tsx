import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { projects } from '../features/projects/data/projects.ts';
import { useThemeMode } from '../providers/AppProviders.tsx';

const drawerWidth = 256;

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { mode, toggleMode } = useThemeMode();
  const isDarkMode = mode === 'dark';

  const drawerContent = useMemo(
    () => (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction='row'
          spacing={1.5}
          alignItems='center'
          sx={{ py: 3.24, px: 3 }}
        >
          <Box>
            <Typography variant='h6'>E2E Dashboard</Typography>
          </Box>
        </Stack>
        <Divider />
        <List sx={{ flex: 1, py: 0, pt: 0 }}>
          <ListItemButton
            component={RouterLink}
            to='/'
            selected={location.pathname === '/'}
            sx={{
              borderRadius: 2,
              mx: 2,
              my: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'common.white',
                },
              },
            }}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary='Visão Geral' />
          </ListItemButton>

          <Divider></Divider>

          <Typography>
            <Box
              sx={{
                p: 2,
                pt: 3,
                pb: 1,
                fontWeight: 'bold',
                color: 'text.secondary',
              }}
            >
              Meus Projetos
            </Box>
          </Typography>

          {projects.map((project) => {
            const href = `/projects/${project.id}`;
            const active = location.pathname.startsWith(href);
            return (
              <ListItemButton
                key={project.id}
                component={RouterLink}
                to={href}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mx: 2,
                  my: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'common.white',
                    },
                  },
                }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={project.name} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    ),
    [location.pathname]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar
        position='fixed'
        color='inherit'
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            marginLeft: '230px',
            py: 3.24,
          }}
        >
          <Stack direction='row' spacing={2} alignItems='center'>
            {!isDesktop && (
              <IconButton edge='start' onClick={() => setMobileOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Box
              component='img'
              src='/logo.png'
              alt='E2E Dashboard'
              sx={{
                height: 'auto',
                maxWidth: 200,
                pl: 3,
                objectFit: 'contain',
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.2s ease',
              }}
            />
          </Stack>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <IconButton
              size='small'
              onClick={toggleMode}
              aria-label={`Ativar modo ${isDarkMode ? 'claro' : 'escuro'}`}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon fontSize='small' />
              ) : (
                <DarkModeOutlinedIcon fontSize='small' />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant='permanent'
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              borderRadius: '0 !important',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 6 },
          mt: { xs: 8, md: 0 },
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar sx={{ display: { xs: 'none', md: 'block' } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
