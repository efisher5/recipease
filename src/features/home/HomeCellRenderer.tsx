import './HomeCellRenderer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { getRecipe } from '../recipes/recipeSlice';

export default function (props: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    
    const fetchRecipe = () => {
        navigate('recipe/' + props.data.recipeId)
    }

    return (
        <div onClick={fetchRecipe} className='link'>
            <button className='link-comp'>{cellValue}</button>
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </div>
    )
}