import { useMemo, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../app/hooks';
import { getRecipe, updateRecipe } from "./recipeSlice";
import { RecipeDto } from "../../openapi";
import DeleteRecipeModal from './DeleteRecipeModal';
import { setRequestHeaders } from '../../services/axios';
import '../../global.css';
import recipeFormStyles from './RecipeForm.module.css';
import recipeCommonStyles from './RecipeCommon.module.css';

interface Values {
    name: string,
    notes: string,
    prepTimeHours: number,
    prepTimeMinutes: number,
    cookTimeHours: number,
    cookTimeMinutes: number,
    ingredients: string,
    instructions: string
}

export default function RecipeForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [recipe, setRecipe] = useState([] as RecipeDto)
    const [isOpen, setIsOpen] = useState(false);

    useMemo(async () => {
        const recipeId = document.URL.split('/')[4];

        const fetchRecipe = async () => {
            const accessToken = await getAccessTokenSilently();
            setRequestHeaders([{ key: 'Authorization', value: `Bearer ${accessToken}` }])
            const res = await dispatch(getRecipe(recipeId)).unwrap();
            
            setRecipe(res!);
        }
        await fetchRecipe();
    }, [])

    const saveForm = async (values: RecipeDto) => {
        const updatedRecipe = {} as RecipeDto;
        updatedRecipe.recipeId = recipe.recipeId;
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
        <div className="mt-2">
            {isOpen && <DeleteRecipeModal setIsOpen={setIsOpen} recipe={recipe} />}
            <div className={recipeCommonStyles.recipeLayout}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: recipe.name || "",
                        notes: recipe.notes || "",
                        prepTimeHours: recipe.prepTimeHours || 0,
                        prepTimeMinutes: recipe.prepTimeMinutes || 0,
                        cookTimeHours: recipe.cookTimeHours || 0,
                        cookTimeMinutes: recipe.cookTimeMinutes || 0,
                        ingredients: recipe.ingredients || '',
                        instructions: recipe.instructions || ''
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
                        <Form>
                            <div>
                                <div className='mb-1'>
                                    <label className={recipeCommonStyles.recipeFormLabel} htmlFor='name'>Recipe Name</label>
                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMaxWidth}`} id='name' name='name' />
                                </div>

                                <div className='mb-1'>
                                    <label className={recipeCommonStyles.recipeFormLabel} htmlFor='notes'>Recipe Notes</label>
                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMaxWidth}`} id='notes' name='notes' />
                                </div>
                            </div>

                            <div className={recipeFormStyles.prepCookTime}>
                                <div className='mb-1'>
                                    <label className={recipeCommonStyles.recipeFormLabel} htmlFor='prepTimeHours'>Prep Time</label>
                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMinWidth}`} id='prepTimeHours' name='prepTimeHours' type='number' /> 
                                    <span>hrs.</span>

                                    <span className='ml-1 mr-1'></span>

                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMinWidth}`} id='prepTimeMinutes' name='prepTimeMinutes' type='number' max='59' />
                                    <span>mins.</span>
                                </div>

                                <div className='mb-1'>
                                    <label className={recipeCommonStyles.recipeFormLabel} htmlFor='cookTimeHours'>Cook Time</label>
                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMinWidth}`} id='cookTimeHours' name='cookTimeHours' type='number' />
                                    <span>hrs.</span>

                                    <span className='ml-1 mr-1'></span>

                                    <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputMinWidth}`} id='cookTimeMinutes' name='cookTimeMinutes' type='number' max='59' />
                                    <span>mins.</span>
                                </div>
                            </div>

                            <label className={recipeCommonStyles.recipeFormLabel} htmlFor='ingredients'>Ingredients</label>
                            <div className="mb-1">
                                <Field component='textarea' rows='10' className={`${recipeFormStyles.input} ${recipeFormStyles.inputFlex} ${recipeFormStyles.textarea}`} id='ingredients' name='ingredients'/>
                            </div>

                            <label className={recipeCommonStyles.recipeFormLabel} htmlFor='instructions'>Instructions</label>
                            <Field component='textarea' rows='10' className={`${recipeFormStyles.input} ${recipeFormStyles.inputFlex} ${recipeFormStyles.textarea}`} id='ingredients' name='ingredients'/>

                            <div className={recipeFormStyles.submitBtnRow}>
                                <button onClick={viewRecipe} type="button" className={recipeFormStyles.recipeFormBtn}>
                                    <span className={recipeCommonStyles.recipeBtnText}>View</span>
                                </button>
                                <button disabled={isOpen} className={`${recipeFormStyles.formBtn} ${recipeFormStyles.deleteBtn}`} type='button' onClick={() => setIsOpen(true)}>Delete</button>
                                <button disabled={isOpen} className={`${recipeFormStyles.formBtn} ${recipeFormStyles.submitBtn}`} type='submit'>Save</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                
            </div>
        </div>
    )
}