import { Button, Flex, Result, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { setInternalServerError } from "../../redux/slices/error";

const InternalServerError = () => {
	const navigate = useNavigate();
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const dispatch = useAppDispatch();

	return (
		<Flex
			justify="center"
			align="center"
			style={{
				width: "100vw",
				height: "100vh",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 1500,
				backgroundColor: colorBgContainer,
			}}
		>
			<Result
				status="500"
				title="Oops, something went wrong."
				subTitle="You may want to try again later"
				extra={
					<Button
						type="primary"
						onClick={() => {
							dispatch(setInternalServerError(false));
							navigate("/");
						}}
					>
						Return to Journey Wonder
					</Button>
				}
			/>
		</Flex>
	);
};

export default InternalServerError;
