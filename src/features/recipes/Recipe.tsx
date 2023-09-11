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
                <li key={instruction} className='instruction'>{ instruction }</li>
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
                <div className="recipe-layout">
                    {/* Recipe Name & Description */}
                    <h1>{ recipe.name }</h1>
                    {recipe.notes && 
                    <div className='recipe-notes-wrapper'>
                        <label className="recipe-form-label">Notes</label>
                        <p className="recipe-notes">{ recipe.notes }</p>
                    </div>
                    }
                    
                    {/* Recipe Prep/Cook Time */}
                    <div className="times">
                        <div className="prep">
                            <label className="recipe-form-label">Prep Time</label>
                            {recipe.prepTimeHours !== 0 && <span>{ recipe.prepTimeHours + (recipe.prepTimeHours === 1 ? " hour " : " hours ") }</span>}
                            <span>{ recipe.prepTimeMinutes + (recipe.prepTimeMinutes === 1 ? " minute" : " minutes") }</span>
                        </div>
                        <div className="cook">
                            <label className="recipe-form-label">Cook Time</label>
                            {recipe.cookTimeHours !== 0 && <span>{ recipe.cookTimeHours + (recipe.cookTimeHours === 1 ? " hour " : " hours ") }</span>}
                            <span>{ recipe.cookTimeMinutes + (recipe.cookTimeMinutes === 1 ? " minute" : " minutes") }</span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="list">
                        <label className="recipe-form-label">Ingredients</label>
                        <ul className="recipe-list ingredient-list">
                            { ingredients }
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="list">
                        <label className="recipe-form-label">Instructions</label>
                        <ol className='instruction-list' type="1">
                            { instructions }
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}