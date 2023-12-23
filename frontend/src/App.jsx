// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage/LoginFormPage'; //modified the import vs the readme due to error w/ 'export default' issue
// import SignupFormPage from './components/SignupFormPage/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';

import LandingPage from './components/LandingPage/LandingPage';
import SpotDetail from './components/SpotDetail/SpotDetail';
import CreateNewSpot from './components/CreateNewSpot/CreateNewSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <>
                 {/* <h1>Welcome!</h1> */}
                 < LandingPage />
                 </>

      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail />
      },
      {
        path: '/spots/new',
        element: <CreateNewSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
