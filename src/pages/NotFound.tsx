import { EmptyState } from '../components/EmptyState.tsx';

export function NotFoundPage() {
  return (
    <EmptyState
      title='Página não encontrada'
      description='Verifique o link acessado ou use o menu para navegar.'
      actionLabel='Voltar'
      onAction={() => history.back()}
    />
  );
}
