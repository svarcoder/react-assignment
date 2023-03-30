import { useSelector } from "react-redux";
import { history } from "_helpers";

export { Home };

function Home() {
	const { userInfo: authUser } = useSelector((x) => x.auth);
	const user = JSON.parse(localStorage.getItem("user"));

	return (
		<div>
			<h1>Hi {authUser?.name || user?.name}!</h1>
			<p>You're logged in with React 18 + Redux & JWT!!</p>
			<h3>Users from secure api end point:</h3>
			<h3>Your Email is {authUser?.email || user?.email}</h3>
			<h3>
				{!authUser?.isEmailVerified || !user?.isEmailVerified
					? "Please Verify Your Mail"
					: "Email Verified"}
			</h3>
			<button
				className='btn btn-primary mt-2'
				type='button'
				onClick={() => history.navigate("/cards/new")}>
				Create New Card
			</button>
			<button
				className='btn btn-primary ml-4 mt-2'
				type='button'
				onClick={() => history.navigate("/cards")}>
				View All Cards
			</button>
		</div>
	);
}
