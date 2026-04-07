import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Mainlayout from './layout/MainLayout.jsx'
import Home from "./routes/Home";
import About from "./routes/About";
import LoginPage from './routes/Login';
import RegisterPage from './routes/Register';
import Dashboard from './routes/Dashboard.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import LogoutPage from './routes/Logout.jsx';
import EditPost from './routes/UpdatePost.jsx';
import PostDetail from './routes/Post.jsx';
// import DeletePost from './routes/DeletePost.jsx';


const router=createBrowserRouter(
[
  {
    element:<Mainlayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/login',
        element:<LoginPage/>
      },
      {
        path:'/register',
        element:<RegisterPage/>
      },
      
        {
          path:'/about',
          element:<About/>
        
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/logout",
        element: (
          <ProtectedRoute>
           <LogoutPage/>
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit/:id",
        element: (
          <ProtectedRoute>
           <EditPost/>
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:id",
        element: <PostDetail />,
      },
     

    ]

  }
]
)


createRoot(document.getElementById('root')).render(
  // <BrowserRouter>
    <RouterProvider router={router}/>
  // </BrowserRouter>

)
