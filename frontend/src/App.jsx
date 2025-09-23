import './App.css';
import { useRoutes } from 'react-router-dom';
import { privateRoutes } from './routes/private.routes';

function App() {

  // for dashboard page use this
  const routes = useRoutes([...privateRoutes]);

  return (
    <>
      <div>{routes}</div>
    </>
  );
}

export default App;