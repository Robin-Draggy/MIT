import './App.css';
import { useRoutes } from 'react-router-dom';
import { privateRoutes } from './routes/private.routes';
import { publicRoutes } from './routes/public.routes';

function App() {
  // To Login page use this 
  // const routes = useRoutes([...publicRoutes]);

  // for dashboard page use this
  const routes = useRoutes([...privateRoutes]);

  return (
    <>
      <div>{routes}</div>
    </>
  );
}

export default App;