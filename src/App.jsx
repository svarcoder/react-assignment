import {
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { history } from "_helpers";
import { Nav, PrivateRoute } from "_components";
import { Home } from "home";
import { Login } from "login";
import { Register } from "register";
import { Cards } from "card";
import { NewCard } from "newCard";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "_store";

export { App };

function App() {
	// init custom history object to allow navigation from
	// anywhere in the react app (inside or outside components)
	history.navigate = useNavigate();
	history.location = useLocation();
	const ref = useRef();
	const dispatch = useDispatch();
	const { userToken } = useSelector((x) => x.auth);

	useEffect(() => {
		if (
			history.location.pathname === "/login" ||
			history.location.pathname === "/register"
		)
			return;
		const tokenData = JSON.parse(localStorage.getItem("token"));
		if (ref.current) return;
		ref.current = true;
		if (!userToken?.access && tokenData) {
			dispatch(authActions.refreshToken({ refreshToken: tokenData?.token }));
		}
	}, []);

	return (
		<div className='app-container bg-light'>
			<Nav />
			<div className='container pt-4 pb-4'>
				<Routes>
					<Route
						path='/'
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route
						path='/cards'
						element={
							<PrivateRoute>
								<Cards />
							</PrivateRoute>
						}
					/>
					<Route
						path='/cards/new'
						element={
							<PrivateRoute>
								<NewCard />
							</PrivateRoute>
						}
					/>
					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</div>
		</div>
	);
}
