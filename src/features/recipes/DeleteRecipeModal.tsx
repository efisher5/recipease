import { useDispatch } from 'react-redux';
import './DeleteRecipeModal.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe } from './recipeSlice';
import { RecipeDto } from '../../openapi';
import { useAppDispatch } from '../../app/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { setRequestHeaders } from '../../services/axios';

interface ModalProps {
    setIsOpen: (isOpen: boolean) => void;
    recipe: RecipeDto
}

export default function DeleteRecipeModal({setIsOpen, recipe}: ModalProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const removeRecipe = async () => {
        const accessToken = await getAccessTokenSilently();
        setRequestHeaders([{ key: 'Authorization', value: `Bearer ${accessToken}` }])
        const res = await dispatch(deleteRecipe(recipe.recipeId!)).unwrap();
        const route = '/';
        navigate(route);
    }

    return (
        <div>
            <div className='darkBG' onClick={() => setIsOpen(false)}>
                <div className='centered'>
                    <div className='modal'>
                        <div className='modalHeader'>
                            <h5 className='heading'>Delete Recipe</h5>
                        </div>
                        <div className='modalContent'>
                            Are you sure you want to delete this recipe?
                        </div>
                        <div className='modalActions'>
                            <div className='actionsContainer'>
                                <button className='cancelBtn' onClick={() => setIsOpen(false)}>Cancel</button>
                                <button className='deleteBtn' onClick={() => removeRecipe()}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}