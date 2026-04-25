import { create } from "zustand";
import { persist } from "zustand/middleware";

const createInitialNotifications = () => ([
	{
		id: "welcome-1",
		title: "Welcome to SGarden",
		message: "Open the notification center to review recent alerts.",
		createdAt: new Date().toISOString(),
		read: false,
	},
	{
		id: "dashboard-1",
		title: "Dashboard refreshed",
		message: "New chart data is available in the dashboards.",
		createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
		read: false,
	},
	{
		id: "profile-1",
		title: "Profile activity",
		message: "Your profile details were loaded successfully.",
		createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
		read: true,
	},
]);

export default create(persist(
	(setState) => ({
		user: {},
		setUser: (user) => setState({ user }),
		defaultPageSize: 5,
		setDefaultPageSize: (defaultPageSize) => setState({ defaultPageSize }),
		favorites: [],
		toggleFavorite: (path) => setState((state) => {
			if (state.favorites.includes(path)) {
				return { favorites: state.favorites.filter((p) => p !== path) };
			}
			return { favorites: [...state.favorites, path] };
		}),
		notifications: createInitialNotifications(),
		addNotification: (notification) => setState((state) => ({
			notifications: [
				{
					id: notification.id || `${Date.now()}`,
					title: notification.title,
					message: notification.message,
					createdAt: notification.createdAt || new Date().toISOString(),
					read: notification.read || false,
				},
				...state.notifications,
			],
		})),
		markNotificationRead: (id) => setState((state) => ({
			notifications: state.notifications.map((notification) => (
				notification.id === id ? { ...notification, read: true } : notification
			)),
		})),
		markAllNotificationsRead: () => setState((state) => ({
			notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
		})),
		clearNotifications: () => setState({ notifications: [] }),
	}),
	{
		name: "sgarden",
	},
));
