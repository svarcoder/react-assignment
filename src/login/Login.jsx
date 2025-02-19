import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { history } from "_helpers";
import { authActions } from "_store";

export { Login };

function Login() {
	const dispatch = useDispatch();
	const authUser = useSelector((x) => x.auth);

	useEffect(() => {
		// redirect to home if already logged in
		if (
			Object.entries(authUser?.userInfo).length > 0 &&
			authUser?.userInfo.constructor === Object
		)
			history.navigate("/");

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// form validation rules
	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email("Must be a valid email")
			.max(255)
			.required("Email is required"),
		password: Yup.string().required("Password is required"),
	});
	const formOptions = { resolver: yupResolver(validationSchema) };

	// get functions to build form with useForm() hook
	const { register, handleSubmit, formState } = useForm(formOptions);
	const { errors, isSubmitting } = formState;

	function onSubmit({ email, password }) {
		return dispatch(authActions.login({ email, password }));
	}

	return (
		<div className='col-md-6 offset-md-3 mt-5'>
			<div className='card'>
				<h4 className='card-header'>Login</h4>
				<div className='card-body'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='form-group'>
							<label>Email</label>
							<input
								name='email'
								type='text'
								{...register("email")}
								className={`form-control ${errors.email ? "is-invalid" : ""}`}
							/>
							<div className='invalid-feedback'>{errors.email?.message}</div>
						</div>
						<div className='form-group'>
							<label>Password</label>
							<input
								name='password'
								type='password'
								{...register("password")}
								className={`form-control ${
									errors.password ? "is-invalid" : ""
								}`}
							/>
							<div className='invalid-feedback'>{errors.password?.message}</div>
						</div>
						<button disabled={isSubmitting} className='btn btn-primary'>
							{isSubmitting && (
								<span className='spinner-border spinner-border-sm mr-1'></span>
							)}
							Login
						</button>
						<button
							className='btn btn-primary ml-2'
							type='button'
							onClick={() => history.navigate("/register")}>
							Register
						</button>
						{authUser?.error && (
							<div className='alert alert-danger mt-3 mb-0'>
								{authUser?.error}
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
