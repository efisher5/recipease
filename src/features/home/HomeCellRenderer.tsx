import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import homeCellRendererStyles from './HomeCellRenderer.module.css';

export default function (props: any) {
    const navigate = useNavigate();
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    
    const fetchRecipe = () => {
        navigate('recipe/' + props.data.recipeId)
    }

    return (
        <div onClick={fetchRecipe} className={ homeCellRendererStyles.link }>
            <button className={ homeCellRendererStyles.linkComp }>{cellValue}</button>
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </div>
    )
}