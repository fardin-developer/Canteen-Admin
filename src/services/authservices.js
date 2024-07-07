import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const API_URL = "http://localhost:8000/api/v1/";





export const login = createAsyncThunk('login', async ({ email, password }, thunkAPI) => {
  try {
    console.log(email, password);
    const response = await axios.post(API_URL + "auth/login", {
      email: email,
      password: password
    });

    // console.log('API Response:', response.data);

    if (response.data.user) {
      // console.log('Setting user in localStorage:', response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.cookies));
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchTest = createAsyncThunk('fetchtest', async () => {
  const response = await fetch('http://localhost:8000/api/v1/meals')
  return response.json()
})

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
