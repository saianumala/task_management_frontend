import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
// import TaskDashboard from "./pages/taskDashboard";
// import { RecoilRoot } from "recoil";
import { ProtectedRoute } from "./components/protectedRoute";
import { Provider } from "react-redux";
// import root from "./store/store";
import TaskManagement from "./components/taskManagement";
import store from "./store/store";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TaskManagement />
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
