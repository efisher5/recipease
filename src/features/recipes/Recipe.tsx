import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch } from '../../app/hooks';
import { getRecipe } from "./recipeSlice";
import { RecipeDto } from "../../openapi";
import { setRequestHeaders } from "../../services/axios";
import recipeStyles from './Recipe.module.css';
import recipeCommonStyles from './RecipeCommon.module.css';

export default function Recipe() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [isLoading, setIsLoading] = useState(true);
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
                <li key={ingredient} className={recipeStyles.ingredient}>{ ingredient }</li>
            );
            let instructions = res!.instructions!.map(instruction =>
                <li key={instruction} className={recipeStyles.instruction}>{ instruction }</li>
            );
            setRecipe(res!);
            setIngredients(ingredients);
            setInstructions(instructions)
            setIsLoading(false);
        }
        await fetchRecipe();
        
        
    }, [])

    const editForm = async () => {
        const route = '/recipe/' + recipe.recipeId + '/edit';
        navigate(route)
    }

    return (
        <div className="mt-1">
            {!isLoading && 
            <div>
                <div className={recipeCommonStyles.recipeBorder}>
                    <div className={recipeCommonStyles.recipeLayout}>
                        {/* Recipe Name & Description */}
                        <h1>{ recipe.name }</h1>
                        {recipe.notes && 
                        <div className={recipeStyles.recipeNotesWrapper}>
                            <label className={recipeCommonStyles.recipeFormLabel}>Notes</label>
                            <p className={recipeStyles.recipeNotes}>{ recipe.notes }</p>
                        </div>
                        }
                        
                        {/* Recipe Prep/Cook Time */}
                        <div className={recipeStyles.times}>
                            <div className={recipeStyles.prep}>
                                <label className={recipeCommonStyles.recipeFormLabel}>Prep Time</label>
                                {recipe.prepTimeHours !== 0 && <span>{ recipe.prepTimeHours + (recipe.prepTimeHours === 1 ? " hour " : " hours ") }</span>}
                                <span>{ recipe.prepTimeMinutes + (recipe.prepTimeMinutes === 1 ? " minute" : " minutes") }</span>
                            </div>
                            <div className={recipeStyles.cook}>
                                <label className={recipeCommonStyles.recipeFormLabel}>Cook Time</label>
                                {recipe.cookTimeHours !== 0 && <span>{ recipe.cookTimeHours + (recipe.cookTimeHours === 1 ? " hour " : " hours ") }</span>}
                                <span>{ recipe.cookTimeMinutes + (recipe.cookTimeMinutes === 1 ? " minute" : " minutes") }</span>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className={recipeStyles.ingredientsList}>
                            <label className={recipeCommonStyles.recipeFormLabel}>Ingredients</label>
                            <ul className={`${recipeStyles.recipeList} ${recipeStyles.ingredientList}`}>
                                { ingredients }
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div className={recipeStyles.list}>
                            <label className={recipeCommonStyles.recipeFormLabel}>Instructions</label>
                            <ol className={recipeStyles.instructionList} type="1">
                                { instructions }
                            </ol>
                        </div>
                    </div>
                </div>

                <div className={recipeStyles.recipeActions}>
                    <button onClick={editForm} type="button" className={recipeCommonStyles.recipeBtn}>
                        <span className={recipeCommonStyles.recipeBtnText}>Edit Recipe</span>
                    </button>
                </div>
            </div>
            }
        </div>
    )
}