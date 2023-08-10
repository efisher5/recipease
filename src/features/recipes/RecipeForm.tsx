import '../../global.css';
import './RecipeForm.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from '../../app/hooks';
import { getRecipe, updateRecipe, deleteRecipe } from "./recipeSlice";
import { RecipeDto } from "../../openapi";
import { Formik, Form, Field, FieldArray } from 'formik';
import DeleteRecipeModal from './DeleteRecipeModal';
import { useAuth0 } from '@auth0/auth0-react';
import { setRequestHeaders } from '../../services/axios';

interface Values {
    name: string,
    description: string,
    prepTime: number,
    cookTime: number,
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
        updatedRecipe.recipeDescription = values.recipeDescription;
        updatedRecipe.cookTime = Number(values.cookTime);
        updatedRecipe.prepTime = Number(values.prepTime);
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
                <button onClick={() => setIsOpen(true)} type="button" className="recipe-btn">
                    <span className="recipe-btn-text">Delete</span>
                    <FontAwesomeIcon icon={faTrash} size="2x" />
                </button>
            </div>
            {isOpen && <DeleteRecipeModal setIsOpen={setIsOpen} recipe={recipe} />}
            <div className="recipe-border">
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: recipe.name || "",
                        description: recipe.recipeDescription || "",
                        prepTime: recipe.prepTime || 0,
                        cookTime: recipe.cookTime || 0,
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

                                {/* <div className='my-1'>
                                    <label className='recipe-form-label' htmlFor='description'>Description</label>
                                    <Field className='input-field-wide' id='description' name='description' />
                                </div> */}
                            </div>

                            <div className='prep-cook-time'>
                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='prepTime'>Prep Time</label>
                                    <Field className='input input-max-width' id='prepTime' name='prepTime' type='number' />
                                </div>

                                <div className='mb-1'>
                                    <label className='recipe-form-label' htmlFor='cookTime'>Cook Time</label>
                                    <Field className='input input-max-width' id='cookTime' name='cookTime' type='number' />
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
                                            <button disabled={isOpen} className='base-btn add-btn' type='button' onClick={() => push({})}>
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
                                            <button disabled={isOpen} className='base-btn add-btn' type='button' onClick={() => push({})}>
                                                <span className='add-btn-span'>Add Instruction</span>
                                                <FontAwesomeIcon icon={faPlus} size="lg" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className='submit-btn-row'>
                                <button disabled={isOpen} className='submit-btn' type='submit'>Save</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                
            </div>
        </div>
    )
}