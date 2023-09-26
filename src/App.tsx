import { Routes, Route } from "react-router-dom";
import './App.scss';
import Home from './features/home/Home';
import Recipe from './features/recipes/Recipe';
import Layout from "./features/layout/Layout";
import RecipeForm from "./features/recipes/RecipeForm";
import LoginFormComponent from "./features/login/Login";
import { AuthenticationGuard } from "./routes/PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route element={<AuthenticationGuard component={Layout} />} path='/'>
        <Route element={<Home />} path=''/>
        <Route element={<Recipe />} path='recipe/:id'/>
        <Route element={<RecipeForm />} path='recipe/:id/edit'/>
      </Route>
      <Route element={<LoginFormComponent />} path='login'/>
    </Routes>
  )
}

export default App;
