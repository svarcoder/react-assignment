import { Navigate } from "react-router-dom";
import { history } from "_helpers";

export { PrivateRoute };

function PrivateRoute({ children }) {
	const user = JSON.parse(localStorage.getItem("user"));

	if (!user) {
		return <Navigate to='/login' state={{ from: history.location }} />;
	}

	return children;
}
