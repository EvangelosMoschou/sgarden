import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Typography, Box } from "@mui/material";
import Image from "mui-image";
import { ExpandMore } from "@mui/icons-material";

import Accordion from "./Accordion.js";

import { jwt } from "../utils/index.js";
import useGlobalState from "../use-global-state.js";

const useStyles = makeStyles((theme) => ({
	sidebar: {
		height: "100%",
		position: "absolute",
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		overflow: "auto",
	},
}));

const ButtonWithText = ({ text, icon, more, handler, testid }) => (
	<span key={text}>
		{!more
		&& (
			<Button key={text} data-testid={testid} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "8px 40px 8px 16px" }} onClick={(event) => handler(event)}>
				{icon && (<Image src={icon} alt={text} fit="contain" width="25px" />)}
				<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{text}
					{more && <ExpandMore />}
				</Typography>
			</Button>
		)}
		{more
		&& (
			<Accordion
				key={text}
				title={(
					<Grid item sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
						<Image src={icon} alt={text} fit="contain" width="25px" />
						<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</Grid>
				)}
				content={(
					<Grid container flexDirection="column" width="100%">
						{more.map((el) => (
							<Button key={el.title} color="white" onClick={el.handler}>
								<Typography sx={{ textTransform: "capitalize" }}>{el.title}</Typography>
							</Button>
						))}
					</Grid>
				)}
				alwaysExpanded={false}
				titleBackground="transparent"
				expandIconColor="white"
			/>
		)}
	</span>
);

const ButtonSimple = ({ text, icon, handler, ind, testid }) => (
	<Button key={text} data-testid={testid} sx={{ minWidth: "30px!important", padding: "0px", marginTop: (ind === 0) ? "0px" : "10px" }} onClick={(event) => handler(event)}>
		<Image src={icon} alt={text} fit="contain" width="30px" />
	</Button>
);

const Sidebar = ({ isSmall: sidebarIsSmall }) => {
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useNavigate();
	const classes = useStyles();
	const favorites = useGlobalState((state) => state.favorites);

	const isAdmin = jwt.isAdmin();

	useEffect(() => setIsSmall(sidebarIsSmall), [sidebarIsSmall]);

	const buttons = [
		...(isAdmin ? [{
			text: "Users",
			handler: () => {
				navigate("/users");
			},
			path: "/users",
		}, {
			text: "Activity Log",
			handler: () => {
				navigate("/activity");
			},
			path: "/activity",
			testid: "sidebar-activity-link"
		}] : []),
		{
			text: "Overview",
			handler: () => {
				navigate("/dashboard");
			},
			path: "/dashboard",
		},
		{
			text: "Analytics",
			handler: () => {
				navigate("/dashboard1");
			},
			path: "/dashboard1",
		},
		{
			text: "Insights",
			handler: () => {
				navigate("/dashboard2");
			},
			path: "/dashboard2",
		},
	];

	const favoriteButtons = favorites
		.map((path) => {
			const btn = buttons.find((b) => b.path === path);
			if (!btn) return null;
			return {
				...btn,
				testid: `sidebar-favorite-${path.substring(1)}`,
			};
		})
		.filter(Boolean);

	return (
		<div className={classes.sidebar} style={{ width: (isSmall) ? "50px" : "200px", padding: (isSmall) ? "20px 5px" : "20px 5px", textAlign: "center" }}>
			{favoriteButtons.length > 0 && (
				<Box data-testid="sidebar-favorites-section" mb={2}>
					{!isSmall && (
						<Typography variant="overline" color="gray" align="left" display="block" pl={2}>
							Favorites
						</Typography>
					)}
					{!isSmall && favoriteButtons.map((button) => (
						<ButtonWithText
							key={`fav-${button.text}`}
							icon={button.icon}
							text={button.text}
							handler={button.handler}
							more={button.more}
							testid={button.testid}
						/>
					))}
					{isSmall && favoriteButtons.map((button, ind) => (
						<ButtonSimple
							key={`fav-${button.text}`}
							icon={button.icon}
							text={button.text}
							handler={button.handler}
							more={button.more}
							ind={ind}
							testid={button.testid}
						/>
					))}
					<hr style={{ borderColor: "rgba(255, 255, 255, 0.2)", margin: "10px 15px", borderTop: "1px solid" }} />
				</Box>
			)}

			{!isSmall && buttons.map((button) => (
				<ButtonWithText
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					testid={button.testid}
				/>
			))}
			{isSmall && buttons.map((button, ind) => (
				<ButtonSimple
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					ind={ind}
					testid={button.testid}
				/>
			))}
		</div>
	);
};

export default Sidebar;
