import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.module.css";
import { cardsActions } from "_store";
import { Deck } from "./Deck";
import { history } from "_helpers";

export { Cards };

function Cards() {
	const dispatch = useDispatch();
	const cardData = useSelector((x) => x.cards);
	const { userToken } = useSelector((x) => x.auth);
	const ref = useRef();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (Object.entries(user).length === 0) history.navigate("/");
	}, []);

	useEffect(() => {
		if (ref.current === userToken?.access) return;
		ref.current = userToken?.access;
		if (userToken?.access) dispatch(cardsActions.getAllCards({ page: 1 }));
	}, [userToken?.access]);

	if (cardData?.error)
		return (
			<div className='col-md-6 offset-md-3 mt-5'>
				<div className='card'>{cardData?.error}</div>
			</div>
		);

	return (
		<>
			<h1>View All Credit Cards</h1>
			<div
				className='col-md-6 offset-md-3 '
				style={{
					marginTop: "30%",
					marginLeft: "35%",
				}}>
				<div className={`center ${styles.container}`}>
					<Deck cards={cardData?.cardInfo} />
				</div>
			</div>
		</>
	);
}
