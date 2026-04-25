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
		defaultDashboard: "/dashboard1",
		setDefaultDashboard: (defaultDashboard) => setState({ defaultDashboard }),
		dateFormat: "MM/DD/YYYY",
		setDateFormat: (dateFormat) => setState({ dateFormat }),
		sidebarCollapsed: false,
		setSidebarCollapsed: (sidebarCollapsed) => setState({ sidebarCollapsed }),
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
		dashboardNotes: {},
		addDashboardNote: (dashboardKey, content) => setState((state) => {
			const dashboardNotes = state.dashboardNotes || {};
			const timestamp = new Date().toISOString();

			return {
				dashboardNotes: {
					...dashboardNotes,
					[dashboardKey]: [
						{
							id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
							content,
							pinned: false,
							createdAt: timestamp,
							updatedAt: timestamp,
						},
						...(dashboardNotes[dashboardKey] || []),
					],
				},
			};
		}),
		updateDashboardNote: (dashboardKey, noteId, updates) => setState((state) => {
			const dashboardNotes = state.dashboardNotes || {};

			return {
				dashboardNotes: {
					...dashboardNotes,
					[dashboardKey]: (dashboardNotes[dashboardKey] || []).map((note) => (
						note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
					)),
				},
			};
		}),
		deleteDashboardNote: (dashboardKey, noteId) => setState((state) => {
			const dashboardNotes = state.dashboardNotes || {};

			return {
				dashboardNotes: {
					...dashboardNotes,
					[dashboardKey]: (dashboardNotes[dashboardKey] || []).filter((note) => note.id !== noteId),
				},
			};
		}),
		toggleDashboardNotePin: (dashboardKey, noteId) => setState((state) => {
			const dashboardNotes = state.dashboardNotes || {};

			return {
				dashboardNotes: {
					...dashboardNotes,
					[dashboardKey]: (dashboardNotes[dashboardKey] || []).map((note) => (
						note.id === noteId ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() } : note
					)),
				},
			};
		}),
	}),
	{
		name: "sgarden",
	},
));