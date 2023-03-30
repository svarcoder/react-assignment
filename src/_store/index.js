import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { cardsReducer } from "./card.slice";

export * from "./auth.slice";
export * from "./users.slice";
export * from "./card.slice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		users: usersReducer,
		cards: cardsReducer,
	},
});
