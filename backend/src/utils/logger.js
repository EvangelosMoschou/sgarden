import Activity from "../models/activity.js";

export const logActivity = async (userId, action, details = "") => {
    try {
        if (!userId) return;
        await Activity.create({ userId, action, details });
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
};
