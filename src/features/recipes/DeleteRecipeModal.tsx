import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { deleteRecipe } from './recipeSlice';
import { RecipeDto } from '../../openapi';
import { useAppDispatch } from '../../app/hooks';
import { setRequestHeaders } from '../../services/axios';
import deleteRecipeModalStyles from './DeleteRecipeModal.module.css';

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
            <div onClick={() => setIsOpen(false)}>
                <div className={deleteRecipeModalStyles.centered}>
                    <div className={deleteRecipeModalStyles.modal}>
                        <h3 className={`${deleteRecipeModalStyles.modalHeader} m-0`}>Delete Recipe</h3>
                        <div className='p-1'>
                            Are you sure you want to delete this recipe?
                        </div>
                        <div className={deleteRecipeModalStyles.modalActions}>
                            <button className={`${deleteRecipeModalStyles.modalBtn} ${deleteRecipeModalStyles.modalCancelBtn}`} onClick={() => setIsOpen(false)}>Cancel</button>
                            <button className={`${deleteRecipeModalStyles.modalBtn} ${deleteRecipeModalStyles.modalDeleteBtn}`} onClick={() => removeRecipe()}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}