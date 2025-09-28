import './App.css';
import { useRoutes } from 'react-router-dom';
import { privateRoutes } from './routes/private.routes';
import { publicRoutes } from './routes/public.routes';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21808D]"></div>
      </div>
    );
  }

  const isLoggedIn = user && user.token;
  const routes = useRoutes(isLoggedIn ? privateRoutes : publicRoutes);

  return (
    <div>{routes}</div>
  );
}

export default App;