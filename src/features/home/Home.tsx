import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch } from "../../app/hooks";
import { RecipeListingDto } from "../../openapi";
import HomeCellRenderer from "./HomeCellRenderer";
import { setRequestHeaders } from "../../services/axios";
import { createRecipe, getRecipes } from "../recipes/recipeSlice";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import homeStyles from './Home.module.css';
import './Table.css'
import '../../global.css';

export default function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
   
    // Get recipe listings
    // Must use useMemo because otherwise component re renders every time
   useMemo(() => {
    const fetchRecipes = async () => {   
        const accessToken = await getAccessTokenSilently();
        setRequestHeaders([{ key: 'Authorization', value: `Bearer ${accessToken}` }])

        const res = await dispatch(getRecipes()).unwrap();
        setRowData(res!);
    }
    fetchRecipes();
   }, [])
    
   // AG Grid Setup
   const [rowData, setRowData] = useState([] as RecipeListingDto[]);
   const defaultColDef = useMemo(() => {
    return {
        filter: 'agTextColumnFilter',
        sortable: true
    }
   }, [])
   const [columnDefs, setColumnDefs] = useState([
       { headerName: 'Recipe', field: 'name', minWidth: 300, flex: 1, cellRenderer: HomeCellRenderer },
       { headerName: 'Time', field: 'totalTime', minWidth: 150 },
       { headerName: 'Date Created', field: 'createdTs', minWidth: 250 }
   ])

   const makeRecipe = async () => {
    const res = await dispatch(createRecipe()).unwrap();
    const route = '/recipe/' + res?.recipeId;
    navigate(route);
   }

   return (
        <div>
            <div className={homeStyles.tableHeader}>
                <button onClick={makeRecipe} type="button" className={homeStyles.recipeBtn}>
                    <span className={homeStyles.newRecipeBtnText}>New Recipe</span>
                </button>
            </div>
            <div className="ag-theme-alpine" style={{height: 650, width: '100%'}}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={25}
                    >
                </AgGridReact>
            </div>
        </div>
   )
}