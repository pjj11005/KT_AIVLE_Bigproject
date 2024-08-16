import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './index';
import { loadUser } from './store/auth/authSlice';
import { AppDispatch } from './store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token: string | null = sessionStorage.getItem('jwtToken');
    if (token) {
      dispatch(loadUser(token));
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
