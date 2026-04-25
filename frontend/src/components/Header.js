import { useMemo, useState, memo } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Button, Paper, Box, Badge, Divider } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	ExpandMore,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	Notifications as NotificationsIcon,
	MoreVert as MoreIcon,
	Person as PersonIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { Image } from "mui-image";

import { jwt, capitalize } from "../utils/index.js";
import useGlobalState from "../use-global-state.js";
import logo from "../assets/images/logo.png";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		flexBasis: "auto",
		background: theme.palette.background.paper,
		zIndex: 1200,
		height: "70px",
	},
	root: {
		height: "30px",
		padding: theme.spacing(0.5),
		borderRadius: "0px",
		background: theme.palette.background.default,
	},
	icon: {
		marginRight: 0.5,
		width: 20,
		height: 20,
	},
	expanded: {
		background: "transparent",
	},
	innerSmallAvatar: {
		color: theme.palette.common.black,
		fontSize: "inherit",
	},
	anchorOriginBottomRightCircular: {
		".MuiBadge-anchorOriginBottomRightCircular": {
			right: 0,
			bottom: 0,
		},
	},
	avatar: {
		width: "30px",
		height: "30px",
		background: theme.palette.background.paper,
	},
	iconButton: {
		padding: "3px 6px",
	},
	notificationMenu: {
		"& .MuiPaper-root": {
			minWidth: 360,
			maxWidth: 420,
			marginTop: 8,
		},
	},
	menuItemButton: {
		width: "100%",
		bgcolor: "grey.light",
		"&:hover": {
			bgcolor: "grey.dark",
		},
	},
	grey: {
		color: "grey.500",
	},
	svgIcon: {
		width: "100%",
		height: "100%",
		"& g": {
			"& path": {
				fill: theme.palette.secondary.main,
			},
		},
	},
}));

const ButtonWithText = ({ text, icon, more, handler, testId }) => (
	<Button sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1, mx: 1 }} onClick={(event) => handler(event)} data-testid={testId}>
		<div style={{ width: "100%", height: "100%" }}>
			{icon}
		</div>
		<Typography align="center" color="secondary.main" fontSize="small" fontWeight="bold" display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
			{text}
			{more && <ExpandMore />}
		</Typography>
	</Button>
);

const Header = ({ isAuthenticated, mode, onToggleMode }) => {
	const classes = useStyles();

	const location = useLocation();
	const navigate = useNavigate();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const isNotificationMenuOpen = Boolean(notificationAnchorEl);
	const notifications = useGlobalState((state) => state.notifications);
	const markNotificationRead = useGlobalState((state) => state.markNotificationRead);
	const markAllNotificationsRead = useGlobalState((state) => state.markAllNotificationsRead);
	const clearNotifications = useGlobalState((state) => state.clearNotifications);

	const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
	const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
	const handleNotificationMenuClose = () => setNotificationAnchorEl(null);
	const handleNotificationMenuOpen = (event) => setNotificationAnchorEl(event.currentTarget);

	const CrumpLink = styled(Link)(({ theme }) => ({ display: "flex", color: theme.palette.third.main }));
	const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);
	const recentNotifications = useMemo(() => [...notifications].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 5), [notifications]);
	const breadcrumbLabelMap = {
		"/dashboard": "Overview",
		"/dashboard1": "Analytics",
		"/dashboard2": "Insights",
		"/activity": "Activity",
		"/profile": "Profile",
		"/map": "Map",
	};

	const buttons = [
		{
			icon: <PersonIcon className={classes.svgIcon} sx={{ fill: "currentColor" }} />,
			text: "Profile",
			handler: () => {
				navigate("/profile");
			},
			testId: "profile-nav-link",
		},
		{
			icon: <LogoutIcon className={classes.svgIcon} />,
			text: "Logout",
			handler: () => {
				jwt.destroyToken();
				navigate("/");
			},
		},
	];

	const renderMobileMenu = (
		<Menu
			keepMounted
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			{buttons.map((button) => (
				<MenuItem key={button.text} onClick={button.handler} data-testid={button.testId}>
					{typeof button.icon.type === "string" || button.icon.type.render ? (
						<div style={{ width: 20, height: 20 }}>{button.icon}</div>
					) : (
						<Image src={button.icon} width="20px" sx={{ fill: "third" }} />
					)}
					<p style={{ marginLeft: "5px" }}>{button.text}</p>
					{button.more && <ExpandMore />}
				</MenuItem>
			))}
		</Menu>
	);

	const renderNotificationMenu = (
		<Menu
			keepMounted
			className={classes.notificationMenu}
			anchorEl={notificationAnchorEl}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isNotificationMenuOpen}
			onClose={handleNotificationMenuClose}
			PaperProps={{ "data-testid": "notification-dropdown" }}
		>
			<Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
				<Typography variant="h6" component="h2">Notifications</Typography>
				<Box sx={{ display: "flex", gap: 1 }}>
					<Button size="small" variant="outlined" onClick={markAllNotificationsRead} data-testid="notification-mark-all-read" disabled={!notifications.length}>
						Mark all as read
					</Button>
					<Button size="small" variant="outlined" color="error" onClick={clearNotifications} data-testid="notification-clear-all" disabled={!notifications.length}>
						Clear all
					</Button>
				</Box>
			</Box>
			<Divider />
			<Box sx={{ maxHeight: 420, overflowY: "auto" }}>
				{recentNotifications.length === 0 ? (
					<Box sx={{ p: 2 }} data-testid="notification-empty">
						<Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
					</Box>
				) : recentNotifications.map((notification) => (
					<MenuItem
						key={notification.id}
						sx={{ alignItems: "flex-start", gap: 1, py: 1.25, px: 2, whiteSpace: "normal" }}
						data-testid={`notification-item-${notification.id}`}
					>
						<Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.75 }}>
							<Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
									{!notification.read && <Box data-testid={`notification-item-unread-${notification.id}`} sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "secondary.main", flex: "0 0 auto" }} />}
									<Box sx={{ minWidth: 0 }}>
										<Typography variant="subtitle2" noWrap>{notification.title}</Typography>
										<Typography variant="body2" color="text.secondary">{notification.message}</Typography>
									</Box>
								</Box>
								{!notification.read && (
									<Button size="small" onClick={() => markNotificationRead(notification.id)} data-testid={`notification-mark-read-${notification.id}`}>
										Mark as read
									</Button>
								)}
							</Box>
							<Typography variant="caption" color="text.secondary">{new Date(notification.createdAt).toLocaleString()}</Typography>
						</Box>
					</MenuItem>
				))}
			</Box>
		</Menu>
	);

	const themeToggleIcon = mode === "dark"
		? <DarkModeIcon data-testid="theme-indicator-dark" />
		: <LightModeIcon data-testid="theme-indicator-light" />;
	const notificationBell = (
		<Badge
			color="error"
			badgeContent={unreadCount}
			sx={{ "& .MuiBadge-badge": { display: unreadCount ? "flex" : "none" } }}
			data-testid="notification-badge"
		>
			<NotificationsIcon />
		</Badge>
	);
	const currentPath = `/${location.pathname.split("/").filter(Boolean)[0] || "dashboard1"}`;
	const currentLabel = breadcrumbLabelMap[currentPath] || capitalize(currentPath.slice(1) || "dashboard1");

	for (const [ind, path] of pathnames.entries()) {
		let text = capitalize(path);
		crumps.push(<CrumpLink to={`/${pathnames.slice(0, ind + 1).join("/")}`}>{text}</CrumpLink>);
	}

	return (
		<>
			<AppBar id="header" position="static" className={classes.grow}>
				<Toolbar className="header-container">
					<Box component={Link} to="/">
						<Image src={logo} alt="Logo" sx={{ p: 0, my: 0, height: "100%", maxWidth: "200px" }} />
					</Box>
					<Box className={classes.grow} style={{ height: "100%" }} />
					<IconButton
						color="inherit"
						onClick={handleNotificationMenuOpen}
						aria-label="Notifications"
						data-testid="notification-bell"
						sx={{ mr: 1 }}
					>
						{notificationBell}
					</IconButton>
					<IconButton
						color="inherit"
						onClick={onToggleMode}
						aria-label="Toggle theme"
						data-testid="dark-mode-toggle"
						sx={{ mr: 1 }}
					>
						{themeToggleIcon}
					</IconButton>
					{isAuthenticated
					&& (
						<>
							<Box sx={{ display: { xs: "none", sm: "none", md: "flex" }, height: "100%", py: 1 }}>
								{buttons.map((button) => (
									<ButtonWithText
										key={button.text}
										icon={button.icon}
										text={button.text}
										handler={button.handler}
										more={button.more}
										testId={button.testId}
									/>
								))}
							</Box>
							<Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
								<IconButton color="primary" onClick={handleMobileMenuOpen}><MoreIcon /></IconButton>
							</Box>
						</>
					)}
				</Toolbar>
			</AppBar>
			{isAuthenticated
			&& (
				<Paper elevation={0} className={classes.root} data-testid="breadcrumb-bar">
					<Box className="header-container" sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
						<CrumpLink to="/dashboard1" data-testid="breadcrumb-home">Home</CrumpLink>
						<Typography component="span" data-testid="breadcrumb-separator" aria-hidden="true">&gt;</Typography>
						<Typography component="span" color="text.primary" data-testid="breadcrumb-current">{currentLabel}</Typography>
					</Box>
				</Paper>
			)}
			{isAuthenticated
			&& (
				<>
					{renderMobileMenu}
					{renderNotificationMenu}
				</>
			)}
		</>
	);
};

export default memo(Header);
