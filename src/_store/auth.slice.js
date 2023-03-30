import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";
import { store } from "_store";

const name = "auth";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
	return {
		loading: false,
		userInfo: {},
		userToken: {},
		error: null,
		success: false,
	};
}

function createExtraActions() {
	const baseUrl = `${process.env.REACT_APP_API_URL}`;

	return {
		login: login(),
		register: register(),
		refreshToken: refreshToken(),
		logout: logout(),
	};

	function login() {
		return createAsyncThunk(
			`${name}/login`,
			async ({ email, password }) =>
				await fetchWrapper.post(`${baseUrl}/auth/login`, { email, password })
		);
	}

	function register() {
		return createAsyncThunk(
			`${name}/register`,
			async ({ name, password, email }) =>
				await fetchWrapper.post(`${baseUrl}/auth/register`, {
					name,
					password,
					email,
				})
		);
	}

	function refreshToken() {
		return createAsyncThunk(
			`${name}/refresh-tokens`,
			async ({ refreshToken }) =>
				await fetchWrapper.post(`${baseUrl}/auth/refresh-tokens`, {
					refreshToken,
				})
		);
	}

	function logout() {
		return createAsyncThunk(
			`${name}/logout`,
			async () =>
				await fetchWrapper.post(`${baseUrl}/auth/logout`, {
					refreshToken: authToken(),
				})
		);
	}
}

function authToken() {
	return store.getState().auth.userToken?.refresh?.token;
}

function createExtraReducers() {
	return {
		...login(),
		...register(),
		...refreshToken(),
		...logOut(),
	};

	function login() {
		var { pending, fulfilled, rejected } = extraActions.login;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				const user = action.payload.user;
				const token = action.payload.tokens;

				localStorage.setItem("token", JSON.stringify(token?.refresh));
				localStorage.setItem("user", JSON.stringify(user));
				state.loading = false;
				state.success = true;
				state.userInfo = user;
				state.userToken = token;

				const { from } = history.location.state || { from: { pathname: "/" } };
				history.navigate(from);
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}

	function register() {
		var { pending, fulfilled, rejected } = extraActions.register;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				const user = action.payload.user;
				const token = action.payload.tokens;

				localStorage.setItem("token", JSON.stringify(token?.refresh));
				localStorage.setItem("user", JSON.stringify(user));
				state.loading = false;
				state.success = true;
				state.userInfo = user;
				state.userToken = token;

				const { from } = history.location.state || {
					from: { pathname: "/" },
				};
				history.navigate(from);
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}

	function refreshToken() {
		var { pending, fulfilled, rejected } = extraActions.refreshToken;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				const token = action.payload;
				console.log(action);

				localStorage.setItem("token", JSON.stringify(token?.refresh));
				state.loading = false;
				state.success = true;

				state.userToken = token;
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}

	function logOut() {
		var { pending, fulfilled, rejected } = extraActions.logout;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				state.userInfo = {};
				state.userToken = {};
				localStorage.clear();

				state.loading = false;
				state.success = false;

				history.navigate("/login");
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}
}
