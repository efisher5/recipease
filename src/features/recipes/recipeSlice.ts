import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultApi } from "../../services/axios";
import { RecipeDto, RecipeListingDto } from "../../openapi";
import { getDate } from "../../services/utils";

export const getRecipes = createAsyncThunk('recipe/getRecipes', async () => {
    try {
        const response = await defaultApi.getRecipes();
        return response.data;
    } catch (error) {
        console.log('getRecipes error: ', error);
    }
})

export const getRecipe = createAsyncThunk('recipe/getRecipe', async (recipeId: string) => {
    try {
        const response = await defaultApi.getRecipe(recipeId);
        return response.data;
    } catch (error) {
        console.log('getRecipe error: ', error)
    }
})

export const createRecipe = createAsyncThunk('recipe/createRecipe', async () => {
    try {
        const response = await defaultApi.createBlankRecipie();
        return response.data;
    } catch (error) {
        console.log('createRecipe error: ', error);
    }
})

export const updateRecipe = createAsyncThunk('recipe/updateRecipe', async (recipe: RecipeDto) => {
    try {
        const response = await defaultApi.updateRecipe(recipe.recipeId!, recipe);
        return response.data;
    } catch (error) {
        console.log('updateRecipe error: ', error);
    }
})

export const deleteRecipe = createAsyncThunk('recipe/deleteRecipe', async (recipeId: string) => {
    try {
        const response = await defaultApi.deleteRecipe(recipeId);
        return response.data;
    } catch (error) {
        console.log('deleteRecipe error: ', error);
    }
})

export const recipeSlice = createSlice({
    name: "recipe",
    initialState: {
        entities: {
            recipeList: {} as RecipeListingDto[],
            recipe: {} as RecipeDto
        }
    },
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(getRecipes.fulfilled, (state, action) => {
                const recipes = action.payload as RecipeListingDto[];

                // Convert all dates into human readable format
                recipes.forEach(recipeListing => recipeListing.createdTs = getDate(recipeListing.createdTs!))
                state.entities.recipeList = recipes!;
            })
            .addCase(getRecipe.fulfilled, (state, actions) => {
                const recipe = actions.payload;
                state.entities.recipe = recipe!;
            })
            .addCase(createRecipe.fulfilled, (state, actions) => {
                const recipe = actions.payload;
                state.entities.recipe = recipe!;
            })
            .addCase(updateRecipe.fulfilled, (state, actions) => {
                const recipe = actions.payload;
                state.entities.recipe = recipe!;
            })
            .addCase(deleteRecipe.fulfilled, (state, actions) => {
                
            })
    }
})

// export const {} = recipeSlice.actions;

export default recipeSlice.reducer;