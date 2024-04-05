import "./App.css";
import { useState } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { LoginComponent } from "./components/LoginComponent";
import { AuthService } from "./services/AuthService";
import { DataService } from "./services/DataService";
import CreateSpace from "./components/spaces/createSpace";

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar username={username} />
          <Outlet />
        </>
      ),
      children: [
        { path: "/", element: <div>Home page</div> },
        {
          path: "/login",
          element: (
            <LoginComponent
              authService={authService}
              setUserNameCb={setUsername}
            />
          ),
        },
        { path: "/profile", element: <div>Profile Page</div> },
        {
          path: "/createSpace",
          element: <CreateSpace dataService={dataService} />,
        },
        { path: "/spaces", element: <div>Spaces Page</div> },
      ],
    },
  ]);
  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
