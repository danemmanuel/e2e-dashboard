import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout.tsx';
import { ProjectsPage } from '../features/projects/pages/ProjectsPage.tsx';
import { ProjectBranchesPage } from '../features/branches/pages/ProjectBranchesPage.tsx';
import { BranchReportPage } from '../features/reports/pages/BranchReportPage.tsx';
import { NotFoundPage } from '../pages/NotFound.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectBranchesPage /> },
      { path: 'projects/:projectId/:branchId', element: <BranchReportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
