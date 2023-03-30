import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";
import { cardsActions } from "_store";
import InputMask from "react-input-mask";
import { history } from "_helpers";

export { NewCard };

function NewCard() {
	const dispatch = useDispatch();
	const cardData = useSelector((x) => x.cards);
	const [data, setData] = useState({
		issuer: "",
		focused: "",
	});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (Object.entries(user).length === 0) history.navigate("/");
	}, []);

	const validationSchema = Yup.object().shape({
		number: Yup.string().required("Enter Your Card Number"),
		expiry: Yup.string()
			.min(4, "Card Expiry Must be 4")
			.required("Enter Your Card Expiry"),
		cvc: Yup.string()
			.min(3, "Card CVC Must be 3")
			.max(4, "Card CVC Must be 3")
			.required("Enter Your Card CVC"),
		name: Yup.string().required("Enter Your Card Holder Name"),
	});

	const formOptions = { resolver: yupResolver(validationSchema) };

	// get functions to build form with useForm() hook
	const { register, handleSubmit, formState, watch, control, reset } =
		useForm(formOptions);

	const number = useWatch({ control, name: "number" });
	const expiry = useWatch({ control, name: "expiry" });
	const cvc = useWatch({ control, name: "cvc" });
	const name = useWatch({ control, name: "name" });

	const { errors, isSubmitting } = formState;

	const onSubmit = ({ number, expiry, cvc, name }) => {
		reset();
		return dispatch(
			cardsActions.createCards({
				name: `${name}'s ${data?.issuer} card`,
				cardExpiration: expiry,
				cardHolder: name,
				cardNumber: number,
				category:
					data?.issuer === "mastercard"
						? "MC"
						: data?.issuer === "amex"
						? "AE"
						: "VISA",
			})
		);
	};

	const handleCallback = ({ issuer }, isValid) => {
		setData((prev) => ({
			...prev,
			issuer,
		}));
	};

	const handleInputFocus = (e) => {
		setData({
			...data,
			focused: e.target.name,
		});
	};

	useEffect(() => {
		const subscription = watch((_, { name }) => {
			setData((prev) => ({
				...prev,
				focused: name,
			}));
		});
		return () => subscription.unsubscribe();
	}, []);

	return (
		<div key='Payment'>
			<div className='App-payment'>
				<h1>Credit Cards </h1>
				<h4>Enter Your Cards Details and Pay Your Payment</h4>
				<Cards
					number={number || ""}
					name={name || ""}
					expiry={expiry || ""}
					cvc={cvc || ""}
					focused={data?.focused}
					callback={handleCallback}
				/>
				<form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
					<div className='form-group'>
						<InputMask
							mask={
								data?.issuer === "amex"
									? "9999 999999 99999"
									: "9999 9999 9999 9999"
							}
							alwaysShowMask={true}
							value={number}
							{...register("number")}
							onFocus={(e) => handleInputFocus(e)}>
							{(inputProps) => (
								<input
									placeholder='Card Number'
									className={`form-control ${
										errors.number ? "is-invalid" : ""
									}`}
									{...inputProps}
								/>
							)}
						</InputMask>

						<div className='invalid-feedback'>{errors.number?.message}</div>
					</div>
					<div className='form-group'>
						<input
							type='text'
							name='name'
							value={name?.toUpperCase()}
							placeholder='Name'
							{...register("name")}
							onFocus={(e) => handleInputFocus(e)}
							className={`form-control ${errors.name ? "is-invalid" : ""}`}
						/>
						<div className='invalid-feedback'>{errors.name?.message}</div>
					</div>
					<div className='row'>
						<div className='col-6'>
							<InputMask
								mask='99/99'
								alwaysShowMask={true}
								value={expiry}
								{...register("expiry")}
								onFocus={(e) => handleInputFocus(e)}>
								{(inputProps) => (
									<input
										placeholder='Expiry Date'
										className={`form-control ${
											errors.expiry ? "is-invalid" : ""
										}`}
										{...inputProps}
									/>
								)}
							</InputMask>

							<div className='invalid-feedback'>{errors.expiry?.message}</div>
						</div>
						<div className='col-6'>
							<input
								type='tel'
								name='cvc'
								placeholder='CVC'
								{...register("cvc")}
								onFocus={(e) => handleInputFocus(e)}
								className={`form-control ${errors.cvc ? "is-invalid" : ""}`}
							/>
							<div className='invalid-feedback'>{errors.cvc?.message}</div>
						</div>
					</div>
					{cardData?.error && (
						<div className='alert alert-danger mt-3 mb-0'>
							{cardData?.error}
						</div>
					)}
					{cardData?.createCard && (
						<div className='alert alert-success mt-3 mb-0'>
							{"Your Payment is Successful"}
						</div>
					)}
					<div className='form-actions'>
						<button
							disabled={isSubmitting}
							className='btn btn-primary btn-block mt-4'>
							{isSubmitting && (
								<span className='spinner-border spinner-border-sm mr-1'></span>
							)}
							Add Card
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
