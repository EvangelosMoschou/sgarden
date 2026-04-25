import express from "express";
import { Activity } from "../models/index.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
    try {
        const { user, action, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (user) {
            query.userId = user;
        }
        
        if (action) {
            query.action = action;
        }
        
        if (dateFrom || dateTo) {
            query.timestamp = {};
            if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
            if (dateTo) query.timestamp.$lte = new Date(dateTo);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const logs = await Activity.find(query)
            .populate('userId', 'username email')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Activity.countDocuments(query);

        return res.json({
            success: true,
            logs,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
});

export default router;
