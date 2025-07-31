const { Op } = require('sequelize');
const User = require('../models/User');
const { Painting } = require('../models/Painting');

const savePainting = async (req, res) => {
    try {
        console.log('Save painting request:', req.body);

        const userId = req.user.userId;
        const paintingData = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const painting = Painting.fromJSON(paintingData);

        if (!painting) {
            return res.status(400).json({
                success: false,
                message: 'Invalid painting data format'
            });
        }

        if (!painting.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Painting data validation failed. Title and valid shapes are required.'
            });
        }

        painting.updateTimestamp();

        const success = user.setPainting(painting);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to save painting data'
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Painting saved successfully',
            data: {
                painting: painting.toJSON(),
                statistics: painting.getStatistics()
            }
        });
    } catch (error) {
        console.error('Save painting error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while saving painting'
        });
    }
};

const loadPainting = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const painting = user.getPainting();

        if (!painting) {
            return res.status(404).json({
                success: false,
                message: 'No painting found for this user'
            });
        }

        res.json({
            success: true,
            message: 'Painting loaded successfully',
            data: {
                painting: painting.toJSON(),
                statistics: painting.getStatistics()
            }
        });
    } catch (error) {
        console.error('Load painting error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while loading painting'
        });
    }
};

const updatePainting = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let painting = user.getPainting();

        if (!painting) {
            return res.status(404).json({
                success: false,
                message: 'No painting found to update'
            });
        }

        if (updateData.title !== undefined) {
            painting.title = updateData.title;
        }

        if (updateData.shapes !== undefined) {
            painting.clearShapes();
            updateData.shapes.forEach(shapeData => {
                painting.addShape(shapeData);
            });
        }

        if (updateData.metadata !== undefined && updateData.metadata.canvasSize) {
            painting.metadata.canvasSize = updateData.metadata.canvasSize;
        }

        painting.updateTimestamp();

        if (!painting.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Updated painting data is invalid'
            });
        }

        const success = user.setPainting(painting);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update painting data'
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Painting updated successfully',
            data: {
                painting: painting.toJSON(),
                statistics: painting.getStatistics()
            }
        });
    } catch (error) {
        console.error('Update painting error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating painting'
        });
    }
};

const deletePainting = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.hasPainting()) {
            return res.status(404).json({
                success: false,
                message: 'No painting found for this user'
            });
        }

        user.setPainting(null);
        await user.save();

        res.json({
            success: true,
            message: 'Painting deleted successfully'
        });
    } catch (error) {
        console.error('Delete painting error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting painting'
        });
    }
};

const getPaintingStatistics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const statistics = user.getPaintingStatistics();

        if (!statistics) {
            return res.status(404).json({
                success: false,
                message: 'No painting found for this user'
            });
        }

        res.json({
            success: true,
            message: 'Painting statistics retrieved successfully',
            data: {
                statistics
            }
        });
    } catch (error) {
        console.error('Get painting statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving statistics'
        });
    }
};

module.exports = {
    savePainting,
    loadPainting,
    updatePainting,
    deletePainting,
    getPaintingStatistics
};
