import { DashboardLayout } from "../layouts/dashboard.layout";
import { NotFound } from "../pages/404";
import { AnnonymizationResults } from "../pages/annonymization-results";


export const privateRoutes = [
    {
    path: "/",
    name: "",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        name: "",
        element: <AnnonymizationResults />,
      },
      {
        path: "*",
        name: "",
        element: <NotFound />,
      },
    
    ],
  },
]