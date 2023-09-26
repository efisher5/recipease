import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './features/home/Home';
import Recipe from './features/recipes/Recipe';
import Layout from "./features/layout/Layout";
import RecipeForm from "./features/recipes/RecipeForm";
import LoginFormComponent from "./features/login/Login";
import { AuthenticationGuard } from "./routes/PrivateRoutes";

const router = createBrowserRouter([
    { 
        path: "/",
        Component: () => <AuthenticationGuard component={Layout} />,
        children: [
            { path: "", Component: Home},
            { path: "recipe/:id", Component: Recipe },
            { path: "recipe/:id/edit", Component: RecipeForm }
        ]
    },
    { path: "login", Component: LoginFormComponent }
])

export default function App() {
    return <RouterProvider router={router} />
}
