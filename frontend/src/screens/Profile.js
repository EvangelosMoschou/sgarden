import { useState, useEffect } from "react";
import { Grid, Typography, Box, Button, TextField, CircularProgress } from "@mui/material";
import Card from "../components/Card.js";
import api from "../api/index.js";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        role: "",
        createdAt: null,
        lastActive: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: "", email: "" });
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const decoded = await api.get("user/decode/");
                if (decoded && decoded.id) {
                    setUserId(decoded.id);
                    const response = await api.get(`user/profile/${decoded.id}`);
                    if (response.success) {
                        setProfile(response.profile);
                        setEditForm({
                            username: response.profile.username,
                            email: response.profile.email
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditForm({
                username: profile.username,
                email: profile.email
            });
        }
    };

    const handleProfileSave = async () => {
        try {
            setMessage({ type: "", text: "" });
            const response = await api.put(`user/profile/${userId}`, editForm);
            
            if (response.success) {
                setProfile({ ...profile, ...editForm });
                setIsEditing(false);
                setMessage({ type: "success", text: "Profile updated successfully." });
            } else {
                setMessage({ type: "error", text: response.message || "Failed to update profile." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred while updating profile." });
        }
    };

    const handlePasswordSave = async () => {
        try {
            setMessage({ type: "", text: "" });
            
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setMessage({ type: "error", text: "New passwords do not match." });
                return;
            }

            const response = await api.put(`user/profile/${userId}/password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (response.success) {
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setMessage({ type: "success", text: "Password updated successfully." });
            } else {
                setMessage({ type: "error", text: response.message || "Failed to update password." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred while updating password." });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container py={2} flexDirection="column" data-testid="profile-page">
            <Typography variant="h4" gutterBottom color="white.main">
                User Profile
            </Typography>

            {message.text && (
                <Box mb={2} p={2} bgcolor={message.type === "success" ? "success.main" : "error.main"} color="white.main" borderRadius={1} data-testid={`profile-${message.type}-message`}>
                    <Typography>{message.text}</Typography>
                </Box>
            )}

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card title="Account Details">
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box>
                                <Typography variant="subtitle2" color="primary.main">Username</Typography>
                                {isEditing ? (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        inputProps={{ "data-testid": "profile-username" }}
                                    />
                                ) : (
                                    <Typography data-testid="profile-username">{profile.username}</Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="primary.main">Email</Typography>
                                {isEditing ? (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        inputProps={{ "data-testid": "profile-email" }}
                                    />
                                ) : (
                                    <Typography data-testid="profile-email">{profile.email}</Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="primary.main">Role</Typography>
                                <Typography data-testid="profile-role" sx={{ textTransform: "capitalize" }}>{profile.role}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="primary.main">Account Created</Typography>
                                <Typography data-testid="profile-created-at">
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="primary.main">Last Active</Typography>
                                <Typography data-testid="profile-last-active">
                                    {profile.lastActive ? new Date(profile.lastActive).toLocaleDateString() : "N/A"}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={2} mt={2}>
                                {isEditing ? (
                                    <>
                                        <Button variant="contained" color="primary" onClick={handleProfileSave} data-testid="profile-save-button">
                                            Save Changes
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={handleEditToggle}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outlined" color="primary" onClick={handleEditToggle} data-testid="profile-edit-button">
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card title="Change Password">
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Current Password"
                                type="password"
                                size="small"
                                fullWidth
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                inputProps={{ "data-testid": "profile-password-current" }}
                            />
                            
                            <TextField
                                label="New Password"
                                type="password"
                                size="small"
                                fullWidth
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                inputProps={{ "data-testid": "profile-password-new" }}
                            />
                            
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                size="small"
                                fullWidth
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                inputProps={{ "data-testid": "profile-password-confirm" }}
                            />

                            <Box mt={1}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handlePasswordSave} 
                                    data-testid="profile-password-save"
                                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Profile;
