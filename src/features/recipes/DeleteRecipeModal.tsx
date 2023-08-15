import './DeleteRecipeModal.css';
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
            <div className='' onClick={() => setIsOpen(false)}>
                <div className='centered'>
                    <div className='modal'>
                        <h3 className='modal-header m-0'>Delete Recipe</h3>
                        <div className='p-1'>
                            Are you sure you want to delete this recipe?
                        </div>
                        <div className='modal-actions'>
                            <button className='modal-btn modal-cancel-btn' onClick={() => setIsOpen(false)}>Cancel</button>
                            <button className='modal-btn modal-delete-btn' onClick={() => removeRecipe()}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}