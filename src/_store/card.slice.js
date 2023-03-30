import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice

const name = "cards";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const cardsActions = { ...slice.actions, ...extraActions };
export const cardsReducer = slice.reducer;

// implementation

function createInitialState() {
	return {
		loading: false,
		cardInfo: [],
		createCard: false,
		error: null,
		page: 0,
		limit: 0,
		totalPages: 0,
		totalResults: 0,
	};
}

function createExtraActions() {
	const baseUrl = `${process.env.REACT_APP_API_URL}`;

	return {
		createCards: createCards(),
		getAllCards: getAllCards(),
	};

	function createCards() {
		return createAsyncThunk(
			`${name}/card/new`,
			async ({ name, cardExpiration, cardHolder, cardNumber, category }) =>
				await fetchWrapper.post(`${baseUrl}/cards`, {
					name,
					cardExpiration,
					cardHolder,
					cardNumber,
					category,
				})
		);
	}

	function getAllCards() {
		return createAsyncThunk(
			`${name}/card`,
			async ({ page }) =>
				await fetchWrapper.get(`${baseUrl}/cards?page=${page}`)
		);
	}
}

function createExtraReducers() {
	return {
		...createCards(),
		...getAllCards(),
	};

	function createCards() {
		const { pending, fulfilled, rejected } = extraActions.createCards;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
				state.createCard = false;
			},
			[fulfilled]: (state, action) => {
				state.loading = false;
				state.createCard = true;
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.createCard = false;
				state.error = error;
			},
		};
	}

	function getAllCards() {
		const { pending, fulfilled, rejected } = extraActions.getAllCards;

		return {
			[pending]: (state) => {
				state.loading = true;
				state.error = null;
			},
			[fulfilled]: (state, action) => {
				const data = action.payload;
				state.loading = false;
				state.page = data?.page;
				state.cardInfo = [...state?.cardInfo, ...data?.results];
				state.limit = data?.limit;
				state.totalPages = data?.totalPages;
				state.totalResults = data?.totalResults;
			},
			[rejected]: (state, action) => {
				const error = action.error.message;
				state.loading = false;
				state.error = error;
			},
		};
	}
}
