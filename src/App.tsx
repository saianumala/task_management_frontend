import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import TaskDashboard from "./pages/taskDashboard";
import { RecoilRoot } from "recoil";
import { ProtectedRoute } from "./components/protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TaskDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
]);
function App() {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
