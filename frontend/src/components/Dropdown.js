import { MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
	custom_filled: {
		backgroundColor: (props) => theme?.palette[props.background]?.main || props.background,
		color: "white!important",
		borderRadius: "10px",
		borderBottom: "0px",
		"&, &:before, &:after": {
			borderBottom: "0px!important",
		},
		"&:hover": {
			backgroundColor: (props) => theme?.palette[props.background]?.dark || props.background,
			borderBottom: "0px",
		},
		"&:focus": {
			backgroundColor: (props) => theme?.palette[props.background]?.dark || props.background,
			borderBottom: "0px",
		},
		"&:before": {
			borderBottom: "0px",
		},
	},
	custom_outlined: {
		backgroundColor: "transparent",
		borderColor: (props) => theme?.palette[props.background]?.main || props.background,
		borderRadius: "10px",
		borderBottom: "0px",
		"&, &:before, &:after": {
			borderBottom: "0px!important",
		},
		"&:hover": {
			backgroundColor: "transparent",
			borderBottom: "0px",
		},
		"&:focus": {
			backgroundColor: "transparent",
			borderBottom: "0px",
		},
		"&:before": {
			borderBottom: "0px",
		},
	},
}));

const Dropdown = ({
	id = "custom-dropdown",
	size = "",
	placeholder = "Placeholder",
	filled = true,
	color = "white",
	background = "secondary",
	showPlaceholder = true,
	width = "",
	height = "100%",
	items = [],
	value,
	onChange,
	testId,
}) => {
	const classes = useStyles({ background });
	const styleClass = filled ? classes.custom_filled : classes.custom_outlined;

	return (
		<Select
			id={id}
			value={value}
			displayEmpty={showPlaceholder}
			className={styleClass}
			size={size}
			style={{ color, width, height }}
			autoWidth={!width}
			classes={{
				filled: styleClass,
				iconFilled: styleClass,
			}}
			sx={{ ">.MuiOutlinedInput-notchedOutline": { border: (filled) ? "none" : "1px solid", borderColor: `${background}.main` } }}
			renderValue={(selected) => (selected || placeholder)}
			onChange={onChange}
			inputProps={{ "data-testid": testId }}
		>
			{items.map((it) => (
				<MenuItem key={it.text} value={it.value}>{it.text}</MenuItem>
			))}
		</Select>
	);
};

export default Dropdown;
