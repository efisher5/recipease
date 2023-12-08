import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch } from "../../app/hooks";
import { RecipeListingDto } from "../../openapi";
import { setRequestHeaders } from "../../services/axios";
import { createRecipe, getRecipes } from "../recipes/recipeSlice";
import homeStyles from './Home.module.css';
import '../../global.css';

export default function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
   
    // Get recipe listings
    // Must use useMemo because otherwise component re renders every time
   useMemo(() => {
    const fetchRecipes = async () => {   
        const accessToken = await getAccessTokenSilently();
        setRequestHeaders([{ key: 'Authorization', value: `Bearer ${accessToken}` }])

        const res = await dispatch(getRecipes()).unwrap();
        setRecipeListings(res!);
    }
    fetchRecipes();
   }, [])
    
   const [recipeListings, setRecipeListings] = useState([] as RecipeListingDto[]);

   const makeRecipe = async () => {
    const res = await dispatch(createRecipe()).unwrap();
    const route = '/recipe/' + res?.recipeId + '/edit';
    navigate(route);
   }

   const fetchRecipe = async (recipeId: string) => {
        navigate('recipe/' + recipeId)
   }

   return (
        <div>
            <div className={homeStyles.tableHeader}>
                <div className={homeStyles.searchAndFilter}>
                    <input className={homeStyles.searchbar} placeholder="Search recipe name or ingredient" />
                    <button className={homeStyles.searchBtn}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                    </button>
                    <button className={homeStyles.filterBtn}>
                        <FontAwesomeIcon icon={faSliders} size="lg" />
                    </button>
                </div>
                <button onClick={makeRecipe} type="button" className={homeStyles.recipeBtn}>
                    <span>New Recipe</span>
                </button>
            </div>
            
            <div className={homeStyles.cardGrid}>
                    {recipeListings.map((recipe, index) => (
                        <div className={homeStyles.card}>
                            <button onClick={() => fetchRecipe(recipe.recipeId!)} type="button" className={homeStyles.cardBtn}>
                                <div className={homeStyles.cardText}>
                                    <div className={homeStyles.cardHeader}>{ recipe.name }</div>
                                    <FontAwesomeIcon icon={faClock} size="sm" />
                                    <span className={homeStyles.time}>30 mins</span>
                                </div>
                                <div className={homeStyles.cardImage}>
                                    Image Placeholder
                                </div>
                            </button>
                        </div>
                    ))}
            </div>
        </div>
   )
}