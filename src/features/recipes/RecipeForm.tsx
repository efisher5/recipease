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
    ingredients: string[],
    instructions: string[]
}

export default function RecipeForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [isLoading, setIsLoading] = useState(true);
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
                <li key={ingredient}>{ ingredient }</li>
            );
            let instructions = res!.instructions!.map(instruction =>
                <li key={instruction}>{ instruction }</li>
            );
            setRecipe(res!);
            setIngredients(ingredients);
            setInstructions(instructions)
            setIsLoading(false);
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
        <div className="mt-2">
            {isOpen && <DeleteRecipeModal setIsOpen={setIsOpen} recipe={recipe} />}
            {!isLoading && 
            <div>
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
                                    <FieldArray name='ingredients'>
                                        {({ insert, remove, push}) => (
                                            <div>
                                                <div className={recipeFormStyles.inputList}>
                                                    {values.ingredients.length > 0 &&
                                                    values.ingredients.map((ingredient, index) => (
                                                        <div className={recipeFormStyles.listElement} key={index}>
                                                            <span><b>{ index + 1 + '.' }</b></span>
                                                            <Field className={`${recipeFormStyles.input} ${recipeFormStyles.inputFlex}`} name={`ingredients.${index}`} />
                                                            <button disabled={isOpen} className='base-btn' type='button' onClick={() => remove(index)}>
                                                                <FontAwesomeIcon icon={faXmark} size='lg' className='danger-color' />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={recipeFormStyles.addBtnRow}>
                                                    <button disabled={isOpen} className={`base-btn ${recipeFormStyles.addBtn}`} type='button' onClick={() => push('')}>
                                                        <span className={recipeFormStyles.addBtnSpan}>Add Ingredient</span>
                                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>

                                <label className={recipeCommonStyles.recipeFormLabel} htmlFor='instructions'>Instructions</label>
                                <FieldArray name='instructions'>
                                    {({ insert, remove, push}) => (
                                        <div>
                                            {values.instructions.length > 0 &&
                                            values.instructions.map((ingredient, index) => (
                                                <div className={recipeFormStyles.listElement} key={index}>
                                                    <span><b>{ index + 1 + '.' }</b></span>
                                                    <Field component='textarea' rows='3' className={`${recipeFormStyles.input} ${recipeFormStyles.inputFlex} ${recipeFormStyles.textarea}`} name={`instructions.${index}`} />
                                                    <button disabled={isOpen} className='base-btn' type='button' onClick={() => remove(index)}>
                                                        <FontAwesomeIcon icon={faXmark} size='lg' className="danger-color"/>
                                                    </button>
                                                </div>
                                            ))}

                                            <div className={recipeFormStyles.addBtnRow}>
                                                <button disabled={isOpen} className={`base-btn ${recipeFormStyles.addBtn}`} type='button' onClick={() => push('')}>
                                                    <span className={recipeFormStyles.addBtnSpan}>Add Instruction</span>
                                                    <FontAwesomeIcon icon={faPlus} size="lg" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </FieldArray>

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
            }
        </div>
    )
}