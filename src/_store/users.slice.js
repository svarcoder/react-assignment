import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice

const name = "users";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
	return {
		loading: false,
		userInfo: {},
		error: null,
		success: false,
		allUser: [],
		page: 1,
		limit: 10,
		totalPages: 0,
		totalResults: 0,
	};
}

function createExtraActions() {
	const baseUrl = `${process.env.REACT_APP_API_URL}`;

	return {
		getSingle: getSingle(),
	};

	function getSingle() {
		return createAsyncThunk(
			`${name}`,
			async ({ id }) =>
				await fetchWrapper.get(`${baseUrl}/users/${id}`, {
					data: id,
				})
		);
	}
}

function createExtraReducers() {
	return {
		...getSingle(),
	};

	function getSingle() {
		var { pending, fulfilled, rejected } = extraActions.getSingle;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				const user = action.payload.user;
				console.log(action);
				state.loading = false;
				state.success = true;
				state.userInfo = user;
			},
			[rejected]: (state, action) => {
				console.log(action);
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}
}
