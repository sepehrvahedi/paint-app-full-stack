const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../utils/validation');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const register = async (req, res) => {
    try {
        const { error } = validateRegistration(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { username, password } = req.body;

        const existingUser = await User.findOne({
            where: { username }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this username already exists'
            });
        }

        const user = await User.create({
            username,
            password
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('Login request:', req.body);

        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username: username }
        });

        console.log('Found user:', user ? `ID: ${user.id}, Username: ${user.username}` : 'No user found');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await user.comparePassword(password);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
