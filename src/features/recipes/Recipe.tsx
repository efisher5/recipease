import { useAppSelector } from "../../app/hooks"
import './Recipe.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppDispatch } from '../../app/hooks';
import { getRecipe } from "./recipeSlice";
import { RecipeDto } from "../../openapi";
import { setRequestHeaders } from "../../services/axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function Recipe() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [recipe, setRecipe] = useState([] as RecipeDto)
    const [ingredients, setIngredients] = useState([] as any);
    const [instructions, setInstructions] = useState([] as any);

    useMemo(async () => {
        const recipeId = document.URL.split('/')[4];

        const fetchRecipe = async () => {
            const accessToken = await getAccessTokenSilently();
            setRequestHeaders([{ key: 'Authorization', value: `Bearer ${accessToken}` }])
            const res = await dispatch(getRecipe(recipeId)).unwrap();
            
            let ingredients = res!.ingredients!.map(ingredient =>
                <li key={ingredient} className='ingredient'>{ ingredient }</li>
            );
            let instructions = res!.instructions!.map(instruction =>
                <li key={instruction}>{ instruction }</li>
            );
            setRecipe(res!);
            setIngredients(ingredients);
            setInstructions(instructions)
        }
        await fetchRecipe();
        
        
    }, [])

    const editForm = async () => {
        const route = '/recipe/' + recipe.recipeId + '/edit';
        navigate(route)
    }

    return (
        <div>
            <div className="recipe-btn-group">
                <button onClick={editForm} type="button" className="recipe-btn">
                    <span className="recipe-btn-text">Edit</span>
                    <FontAwesomeIcon icon={faPenToSquare} size="2x" />
                </button>
            </div>
            <div className="recipe-border">
                {/* Recipe Name & Description */}
                <h1>{ recipe.name }</h1>
                {recipe.recipeDescription && <h3>{ recipe.recipeDescription }</h3>}
                
                {/* Recipe Prep/Cook Time */}
                <div className="times">
                    <div className="prep">
                        <h4>Prep Time</h4>
                        <p>{ recipe.prepTime + " minutes" }</p>
                    </div>
                    <div className="cook">
                        <h4>Cook Time</h4>
                        <p>{ recipe.cookTime + " minutes"}</p>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="list">
                    <h4>Ingredients</h4>
                    <ul>
                        { ingredients }
                    </ul>
                </div>

                {/* Instructions */}
                <div className="list">
                    <h4>Instructions</h4>
                    <ol type="1">
                        { instructions }
                    </ol>
                </div>
            </div>
        </div>
    )
}