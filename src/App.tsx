import { useRoutes } from "react-router-dom";
import './App.scss';
import Home from './features/home/Home';
import Recipe from './features/recipes/Recipe';
import Layout from "./features/layout/Layout";
import RecipeForm from "./features/recipes/RecipeForm";
import LoginFormComponent from "./features/login/Login";

function App() {
  const routes = useRoutes([
    { path: '/', element: <Layout />, children: [
      { path: '', element: <Home /> },
      { path: 'recipe/:id', element: <Recipe /> },
      { path: 'recipe/:id/edit', element: <RecipeForm />},
    ]},
    { path: 'login', element: <LoginFormComponent /> }
  ])

  return routes;
}

export default App;
