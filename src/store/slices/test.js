import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../services/authservices";
import { getCookie } from "../../../utils/cookieUtils";

const initialState = {
    isAuthenticated: false,
    user: null,
};

// Check for token in cookies
const token = getCookie('token');
if (token) {
    initialState.isAuthenticated = true;
    // Optionally, you can decode the token to get user information
    // initialState.user = decodeToken(token); 
}

const testSlice = createSlice({
    name: 'test',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        });
        builder.addCase(login.pending, (state, action) => {
            state.isAuthenticated = false;
            state.user = 'pending';
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
        });
    }
});

export default testSlice.reducer;
