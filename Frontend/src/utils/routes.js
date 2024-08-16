import Home from '../pages/Home';
import Notice from '../pages/Notice';
import CreateNotice from '../pages/CreateNotice';
import ProfileDetail from '../pages/ProfileDetail/ProfileDetail';
import AdminPage from '../pages/AdminPage';
import Consultant from '../pages/Consultant';
import MacManagement from '../pages/MacManagement';
import Call from '../pages/Call';
import BeforeCall from '../pages/BeforeCall';
import Dashboard from '../pages/Dashboard';
import NoticeDetail from '../pages/Notice/NoticeDetail';
import AdminNotice from 'pages/Notice/AdminNotice';
import { useParams } from 'react-router-dom';
export const ADMIN_BASE_URL = '/admin';
export const ROUTES = {
  HOME: '/home',
  NOTICE: '/notice',
  ADMIN_NOTICE: 'admin/notice',
  CREATE_NOTICE: '/create',
  DASH_BOARD: '/dashboard',
  MYPAGE: '/mypage',
  PROFILE_DETAIL: '/profile/:id',
  ADMIN: '/admin',
  CONSULTANT: ADMIN_BASE_URL + '/consultant',
  CLIENT: ADMIN_BASE_URL + '/client/caution',
  NOTICE_DETAIL: '/notice/:id',
  EDIT_NOTICE: '/notice/edit/:id',
  CALL: '/call',
  BEFORECALL: '/callnote/:id',
  BEFORECALLDetail: '/callnoteDetail/:id',
};

function NoticeDetailWrapper() {
  const { id } = useParams();
  return <NoticeDetail key={id} />;
}

export const routes = [
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.NOTICE,
    element: <Notice />,
  },
  {
    path: ROUTES.ADMIN_NOTICE,
    element: <AdminNotice />,
  },
  {
    path: ROUTES.DASH_BOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.CREATE_NOTICE,
    element: <CreateNotice />,
  },
  {
    path: ROUTES.EDIT_NOTICE,
    element: <CreateNotice />,
  },
  {
    path: ROUTES.MYPAGE,
    element: <ProfileDetail />,
  },
  {
    path: ROUTES.PROFILE_DETAIL,
    element: <ProfileDetail />,
  },
  {
    path: ROUTES.ADMIN,
    element: <AdminPage />,
  },
  {
    path: ROUTES.CONSULTANT,
    element: <Consultant />,
  },
  {
    path: ROUTES.CLIENT,
    element: <MacManagement />,
  },
  {
    path: ROUTES.NOTICE_DETAIL,
    element: <NoticeDetailWrapper />,
  },
  {
    path: ROUTES.CALL,
    element: <Call />,
  },
  {
    path: ROUTES.BEFORECALL,
    element: <BeforeCall />,
  },
];
