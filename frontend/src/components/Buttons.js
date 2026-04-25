import { Typography, Button } from "@mui/material";

const BaseButton = ({
	id,
	type = "button",
	disabled = false,
	className = "",
	titleClassName = "",
	titleColor,
	size = "",
	width = "200px",
	title = "Button",
	variant = "contained",
	color = "primary",
	backgroundColor,
	borderWidth,
	borderColor,
	onClick,
}) => (
	<Button
		key={id}
		id={id}
		type={type}
		disabled={disabled}
		className={className}
		variant={variant}
		color={color}
		size={size || ""}
		style={{ 
			...(width && { width }), 
			...(backgroundColor && { backgroundColor }),
			...(borderWidth && { borderWidth }),
			...(borderColor && { borderColor })
		}}
		onClick={onClick}
	>
		<Typography className={titleClassName} sx={{ color: `${titleColor}!important` }} style={{ textTransform: "none" }}>
			<b>
				{title}
			</b>
		</Typography>
	</Button>
);

export const PrimaryBackgroundButton = (props) => (
	<BaseButton
		id="primary-background-button"
		titleColor="white"
		color="primary"
		variant="contained"
		{...props}
	/>
);

export const PrimaryBorderButton = (props) => (
	<BaseButton
		id="primary-border-button"
		titleColor="primary"
		color="primary"
		variant="outlined"
		backgroundColor="white"
		borderWidth="3px"
		borderColor={props.titleColor || "primary"}
		{...props}
	/>
);

export const SecondaryBackgroundButton = (props) => (
	<BaseButton
		id="secondary-background-button"
		titleColor="white"
		color="secondary"
		variant="contained"
		{...props}
	/>
);

export const SecondaryBorderButton = (props) => (
	<BaseButton
		id="secondary-border-button"
		titleColor="secondary"
		color="secondary"
		variant="outlined"
		backgroundColor="white"
		borderWidth="3px"
		{...props}
	/>
);

export const HighlightBackgroundButton = (props) => (
	<BaseButton
		id="highlight-background-button"
		titleColor="white"
		color="third"
		variant="contained"
		{...props}
	/>
);

export const HighlightBorderButton = (props) => (
	<BaseButton
		id="highlight-border-button"
		titleColor="third"
		color="third"
		variant="outlined"
		backgroundColor="white"
		borderWidth="3px"
		{...props}
	/>
);

export const SuccessBackgroundButton = (props) => (
	<BaseButton
		id="success-background-button"
		titleColor="white"
		color="success"
		variant="contained"
		{...props}
	/>
);

export const ErrorBackgroundButton = (props) => (
	<BaseButton
		id="error-background-button"
		titleColor="white"
		color="error"
		variant="contained"
		{...props}
	/>
);

export const InfoBackgroundButton = (props) => (
	<BaseButton
		id="info-background-button"
		titleColor="white"
		color="info"
		variant="contained"
		{...props}
	/>
);
