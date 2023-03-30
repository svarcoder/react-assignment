import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "_store";

export { Nav };

function Nav() {
	const { userInfo: authUser } = useSelector((x) => x.auth);
	const dispatch = useDispatch();
	const tokenData = JSON.parse(localStorage.getItem("token"));

	const logout = () =>
		dispatch(authActions.logout({ refreshToken: tokenData?.token }));

	if (!authUser) return null;

	return (
		<nav className='navbar navbar-expand navbar-dark bg-dark'>
			<div className='navbar-nav'>
				<NavLink to='/' className='nav-item nav-link'>
					Home
				</NavLink>
				<button onClick={logout} className='btn btn-link nav-item nav-link'>
					Logout
				</button>
			</div>
		</nav>
	);
}
