import { useMemo, useState } from "react";
import { Box, Button, Divider, Drawer, IconButton, Paper, TextField, Typography } from "@mui/material";
import {
	Add as AddIcon,
	Close as CloseIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	PushPin as PushPinIcon,
	PushPinOutlined as PushPinOutlinedIcon,
} from "@mui/icons-material";

import useGlobalState from "../use-global-state.js";

const sortNotes = (notes) => [...notes].sort((left, right) => {
	if (left.pinned !== right.pinned) {
		return left.pinned ? -1 : 1;
	}

	return new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime();
});

const NotesPanel = ({ dashboardKey, title }) => {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState("");
	const [editingNoteId, setEditingNoteId] = useState(null);
	const [editingValue, setEditingValue] = useState("");

	const notes = useGlobalState((state) => state.dashboardNotes?.[dashboardKey] || []);
	const addDashboardNote = useGlobalState((state) => state.addDashboardNote);
	const updateDashboardNote = useGlobalState((state) => state.updateDashboardNote);
	const deleteDashboardNote = useGlobalState((state) => state.deleteDashboardNote);
	const toggleDashboardNotePin = useGlobalState((state) => state.toggleDashboardNotePin);

	const sortedNotes = useMemo(() => sortNotes(notes), [notes]);

	const handleAddNote = () => {
		const content = draft.trim();

		if (!content) {
			return;
		}

		addDashboardNote(dashboardKey, content);
		setDraft("");
	};

	const handleStartEdit = (note) => {
		setEditingNoteId(note.id);
		setEditingValue(note.content);
	};

	const handleSaveEdit = (noteId) => {
		const content = editingValue.trim();

		if (!content) {
			return;
		}

		updateDashboardNote(dashboardKey, noteId, { content });
		setEditingNoteId(null);
		setEditingValue("");
	};

	const handleCancelEdit = () => {
		setEditingNoteId(null);
		setEditingValue("");
	};

	return (
		<>
			<Button
				variant="outlined"
				size="small"
				startIcon={<AddIcon />}
				onClick={() => setOpen((value) => !value)}
				data-testid="notes-toggle-button"
				sx={{ alignSelf: "flex-end", mb: 1 }}
			>
				{open ? "Hide Notes" : "Show Notes"}
			</Button>
			<Drawer
				anchor="right"
				open={open}
				onClose={() => setOpen(false)}
				ModalProps={{ keepMounted: true }}
				PaperProps={{
					"data-testid": "notes-panel",
					sx: { width: { xs: 320, sm: 380 }, p: 2, boxSizing: "border-box" },
				}}
			>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
						<Typography variant="h6">{title}</Typography>
						<IconButton onClick={() => setOpen(false)} aria-label="Close notes panel">
							<CloseIcon />
						</IconButton>
					</Box>
					<Divider />
					<Box data-testid="notes-list" sx={{ display: "flex", flexDirection: "column", gap: 1.25, overflowY: "auto", flex: 1, pr: 0.5 }}>
						{sortedNotes.length === 0 ? (
							<Box data-testid="notes-empty" sx={{ py: 2 }}>
								<Typography variant="body2" color="text.secondary">
									No notes yet. Add the first observation for this dashboard.
								</Typography>
							</Box>
						) : sortedNotes.map((note) => {
							const isEditing = editingNoteId === note.id;

							return (
								<Paper key={note.id} elevation={1} data-testid={`notes-item-${note.id}`} sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
									<Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
											{note.pinned && (
												<Box data-testid={`notes-item-pinned-${note.id}`} sx={{ display: "flex", alignItems: "center", color: "secondary.main" }}>
													<PushPinIcon fontSize="small" />
												</Box>
											)}
											{isEditing ? (
												<TextField
													fullWidth
													multiline
													minRows={3}
													value={editingValue}
													onChange={(event) => setEditingValue(event.target.value)}
													inputProps={{ "data-testid": `notes-item-content-${note.id}` }}
												/>
											) : (
												<Typography data-testid={`notes-item-content-${note.id}`} variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
													{note.content}
												</Typography>
											)}
										</Box>
										<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
											<IconButton
												data-testid={`notes-item-pin-${note.id}`}
												onClick={() => toggleDashboardNotePin(dashboardKey, note.id)}
												aria-label={note.pinned ? "Unpin note" : "Pin note"}
												size="small"
											>
												{note.pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
											</IconButton>
											<IconButton
												data-testid={`notes-item-edit-${note.id}`}
												onClick={() => handleStartEdit(note)}
												size="small"
											>
												<EditIcon fontSize="small" />
											</IconButton>
											<IconButton
												data-testid={`notes-item-delete-${note.id}`}
												onClick={() => deleteDashboardNote(dashboardKey, note.id)}
												size="small"
											>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Box>
									</Box>
									{isEditing && (
										<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
											<Button size="small" onClick={handleCancelEdit}>Cancel</Button>
											<Button size="small" variant="contained" onClick={() => handleSaveEdit(note.id)}>Save</Button>
										</Box>
									)}
								</Paper>
							);
						})}
					</Box>
					<Divider />
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
						<TextField
							label="Add note"
							multiline
							minRows={3}
							value={draft}
							onChange={(event) => setDraft(event.target.value)}
							inputProps={{ "data-testid": "notes-add-input" }}
						/>
						<Button variant="contained" onClick={handleAddNote} data-testid="notes-add-submit" disabled={!draft.trim()}>
							Add Note
						</Button>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

export default NotesPanel;