import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, InputAdornment, TextField, Box, Typography, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, History as HistoryIcon, Dashboard as DashboardIcon, Person as PersonIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const mockData = [
	{ id: "d1", title: "Overview Dashboard", category: "Dashboards", path: "/dashboard" },
	{ id: "d2", title: "Analytics", category: "Dashboards", path: "/dashboard1" },
	{ id: "d3", title: "Insights", category: "Dashboards", path: "/dashboard2" },
	{ id: "u1", title: "Admin User", category: "Users", path: "/users" },
	{ id: "u2", title: "John Doe", category: "Users", path: "/users" },
	{ id: "p1", title: "My Profile", category: "Settings", path: "/profile" },
	{ id: "a1", title: "Activity Log", category: "Settings", path: "/activity" },
];

const GlobalSearch = ({ open, onClose }) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [recentSearches, setRecentSearches] = useState([]);

	useEffect(() => {
		const storedSearches = localStorage.getItem("recentSearches");
		if (storedSearches) {
			try {
				setRecentSearches(JSON.parse(storedSearches));
			} catch (e) {}
		}
	}, []);

	const handleClose = useCallback(() => {
		setQuery("");
		onClose();
	}, [onClose]);

	const handleNavigate = useCallback((result) => {
		if (result && result.title) {
			const updatedSearches = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
			setRecentSearches(updatedSearches);
			localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
		}
		handleClose();
		if (result && result.path) {
			navigate(result.path);
		}
	}, [navigate, recentSearches, handleClose]);

	const results = useMemo(() => {
		if (!query.trim()) return [];
		return mockData.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
	}, [query]);

	const groupedResults = useMemo(() => {
		const groups = {};
		results.forEach(result => {
			if (!groups[result.category]) groups[result.category] = [];
			groups[result.category].push(result);
		});
		return groups;
	}, [results]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			data-testid="global-search-dialog"
			PaperProps={{
				sx: { borderRadius: 2, top: "-10vh", position: "relative" }
			}}
		>
			<DialogTitle sx={{ p: 1 }}>
				<TextField
					fullWidth
					autoFocus
					variant="outlined"
					placeholder="Search..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					data-testid="global-search-input"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handleClose} data-testid="global-search-close" size="small">
									<CloseIcon />
								</IconButton>
							</InputAdornment>
						)
					}}
				/>
			</DialogTitle>
			<DialogContent sx={{ p: 0, minHeight: 300 }}>
				{query.trim() === "" ? (
					recentSearches.length > 0 ? (
						<Box data-testid="global-search-recent" sx={{ p: 2 }}>
							<Typography variant="overline" color="textSecondary">Recent Searches</Typography>
							<List>
								{recentSearches.map((search, index) => (
									<ListItem
										button
										key={index}
										data-testid={`global-search-recent-item-${index}`}
										onClick={() => setQuery(search)}
									>
										<HistoryIcon sx={{ mr: 2, color: "text.secondary" }} fontSize="small" />
										<ListItemText primary={search} />
									</ListItem>
								))}
							</List>
						</Box>
					) : (
						<Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
							<Typography>Type to start searching...</Typography>
						</Box>
					)
				) : (
					<Box data-testid="global-search-results">
						{results.length > 0 ? (
							Object.entries(groupedResults).map(([category, items]) => (
								<Box key={category} sx={{ mb: 1 }}>
									<Typography
										variant="overline"
										color="primary"
										sx={{ px: 2, pt: 1, display: "block", fontWeight: "bold" }}
										data-testid={`global-search-category-${category}`}
									>
										{category}
									</Typography>
									<List disablePadding>
										{items.map((item) => (
											<ListItem
												button
												key={item.id}
												data-testid={`global-search-result-${item.id}`}
												onClick={() => handleNavigate(item)}
												sx={{ px: 3 }}
											>
												{category === "Dashboards" ? <DashboardIcon sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> : <PersonIcon sx={{ mr: 2, color: "text.secondary" }} fontSize="small" />}
												<ListItemText
													primary={item.title}
													primaryTypographyProps={{ "data-testid": `global-search-result-title-${item.id}` }}
												/>
											</ListItem>
										))}
									</List>
									<Divider />
								</Box>
							))
						) : (
							<Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
								<Typography data-testid="global-search-no-results">No results found for "{query}"</Typography>
							</Box>
						)}
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default GlobalSearch;
