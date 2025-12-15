import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface ReportViewerProps {
  src: string;
}

export function ReportViewer({ src }: ReportViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const loader = loadingRef.current;

    function handleLoad() {
      if (loader) loader.style.display = 'none';
    }

    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [src]);

  if (!src) {
    return (
      <Alert severity='warning'>
        Nenhum report disponível para esta branch.
      </Alert>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: 480 }}>
      <Box
        ref={loadingRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress size={32} />
      </Box>
      <iframe
        ref={iframeRef}
        src={src}
        title='E2E Report'
        style={{
          border: '1px solid rgba(15, 23, 42, 0.1)',
          borderRadius: 16,
          width: '100%',
          height: '80vh',
        }}
      />
    </Box>
  );
}
