import '../../global.css';
import './RecipeForm.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppDispatch } from '../../app/hooks';
import { getRecipe, updateRecipe } from "./recipeSlice";
import { RecipeDto } from "../../openapi";
import { Formik, Form, Field, FieldArray } from 'formik';
import DeleteRecipeModal from './DeleteRecipeModal';
import { useAuth0 } from '@auth0/auth0-react';
import { setRequestHeaders } from '../../services/axios';

interface Values {
    name: string,
    notes: string,
    prepTimeHours: number,
    prepTimeMinutes: number,
    cookTimeHours: number,
    cookTimeMinutes: number,
    ingredients: string[],
    instructions: string[]
}

export default function RecipeForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [recipe, setRecipe] = useState([] as RecipeDto)
    const [ingredients, setIngredients] = useState([] as any);
    const [instructions, setInstructions] = useState([] as any);
    const [isOpen, setIsOpen] = useState(false);

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

    const saveForm = async (values: RecipeDto) => {
        const updatedRecipe = {} as RecipeDto;
        updatedRecipe.recipeId = recipe.recipeId;
        updatedRecipe.userId = recipe.userId;
        updatedRecipe.name = values.name;
        updatedRecipe.notes = values.notes;
        updatedRecipe.prepTimeHours = Number(values.prepTimeHours);
        updatedRecipe.cookTimeMinutes = Number(values.cookTimeMinutes);
        updatedRecipe.cookTimeHours = Number(values.cookTimeHours);
        updatedRecipe.prepTimeMinutes = Number(values.prepTimeMinutes);
        updatedRecipe.ingredients = values.ingredients;
        updatedRecipe.instructions = values.instructions;
        
        const res = await dispatch(updateRecipe(updatedRecipe)).unwrap();
        console.log(res);

        const route = '/recipe/' + recipe.recipeId;
        navigate(route)
    }

    const viewRecipe = async () => {
        const route = '/recipe/' + recipe.recipeId;
        navigate(route);
    }

    return (
        <div>
            <div className="recipe-btn-group">
                <button onClick={viewRecipe} type="button" className="recipe-btn">
                    <span className="recipe-btn-text">View</span>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
                </button>
            </div>
            {isOpen && <DeleteRecipeModal setIsOpen={setIsOpen} recipe={recipe} />}
            <div className="recipe-border">
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: recipe.name || "",
                        notes: recipe.notes || "",
                        prepTimeHours: recipe.prepTimeHours || 0,
                        prepTimeMinutes: recipe.prepTimeMinutes || 0,
                        cookTimeHours: recipe.cookTimeHours || 0,
                        cookTimeMinutes: recipe.cookTimeMinutes || 0,
                        ingredients: recipe.ingredients || [''],
                        instructions: recipe.instructions || ['']
                    }}
                    onSubmit={(
                        values: Values
                    ) => {
                        setTimeout(() => {
                            saveForm(values);
                        }, 500)
                    }}
                >
                    {({ values }) => (
                        <Form className='recipe-form'>
                            <div>
                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='name'>Recipe Name</label>
                                    <Field className='input input-max-width' id='name' name='name' />
                                </div>

                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='notes'>Recipe Notes</label>
                                    <Field className='input input-max-width' id='notes' name='notes' />
                                </div>
                            </div>

                            <div className='prep-cook-time'>
                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='prepTimeHours'>Prep Time</label>
                                    <Field className='input input-min-width' id='prepTimeHours' name='prepTimeHours' type='number' /> 
                                    <span>hrs.</span>

                                    <span className='ml-1 mr-1'></span>

                                    <Field className='input input-min-width' id='prepTimeMinutes' name='prepTimeMinutes' type='number' max='59' />
                                    <span>mins.</span>
                                </div>

                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='cookTimeHours'>Cook Time</label>
                                    <Field className='input input-min-width' id='cookTimeHours' name='cookTimeHours' type='number' />
                                    <span>hrs.</span>

                                    <span className='ml-1 mr-1'></span>

                                    <Field className='input input-min-width' id='cookTimeMinutes' name='cookTimeMinutes' type='number' max='59' />
                                    <span>mins.</span>
                                </div>
                            </div>

                            <label className='recipe-form-label' htmlFor='ingredients'>Ingredients</label>
                            <FieldArray name='ingredients'>
                                {({ insert, remove, push}) => (
                                    <div>
                                        {values.ingredients.length > 0 &&
                                        values.ingredients.map((ingredient, index) => (
                                            <div className='instruction-element' key={index}>
                                                <span><b>{ index + 1 + '.' }</b></span>
                                                <Field className='input input-flex' name={`ingredients.${index}`} />
                                                <button disabled={isOpen} className='base-btn' type='button' onClick={() => remove(index)}>
                                                    <FontAwesomeIcon icon={faXmark} size='lg' className='secondary-color' />
                                                </button>
                                            </div>
                                        ))}

                                        <div className='add-btn-row'>
                                            <button disabled={isOpen} className='base-btn add-btn' type='button' onClick={() => push('')}>
                                                <span className='add-btn-span'>Add Ingredient</span>
                                                <FontAwesomeIcon icon={faPlus} size="lg" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <label className='recipe-form-label' htmlFor='instructions'>Instructions</label>
                            <FieldArray name='instructions'>
                                {({ insert, remove, push}) => (
                                    <div className='input-list'>
                                        {values.instructions.length > 0 &&
                                        values.instructions.map((ingredient, index) => (
                                            <div className='instruction-element' key={index}>
                                                <span><b>{ index + 1 + '.' }</b></span>
                                                <Field component='textarea' rows='3' className='input input-flex textarea' name={`instructions.${index}`} />
                                                <button disabled={isOpen} className='base-btn' type='button' onClick={() => remove(index)}>
                                                    <FontAwesomeIcon icon={faXmark} size='lg' className="secondary-color"/>
                                                </button>
                                            </div>
                                        ))}

                                        <div className='add-btn-row'>
                                            <button disabled={isOpen} className='base-btn add-btn' type='button' onClick={() => push('')}>
                                                <span className='add-btn-span'>Add Instruction</span>
                                                <FontAwesomeIcon icon={faPlus} size="lg" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className='submit-btn-row'>
                                <button disabled={isOpen} className='form-btn delete-btn' type='button' onClick={() => setIsOpen(true)}>Delete</button>
                                <button disabled={isOpen} className='form-btn submit-btn' type='submit'>Save</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                
            </div>
        </div>
    )
}