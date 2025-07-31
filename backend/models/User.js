const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const { Painting } = require('./Painting');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50],
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
            notEmpty: true
        }
    },
    paintingData: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'JSON string containing the complete painting data'
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getPainting = function() {
    if (!this.paintingData) {
        return null;
    }
    return Painting.fromJSON(this.paintingData);
};

User.prototype.setPainting = function(paintingData) {
    if (!paintingData) {
        this.paintingData = null;
        return;
    }

    let painting;

    if (paintingData instanceof Painting) {
        painting = paintingData;
    } else {
        painting = Painting.fromJSON(paintingData);
    }

    if (painting && painting.isValid()) {
        this.paintingData = painting.toString();
        return true;
    } else {
        console.error('Invalid painting data provided');
        return false;
    }
};

User.prototype.getPaintingJSON = function() {
    const painting = this.getPainting();
    return painting ? painting.toJSON() : null;
};

User.prototype.hasPainting = function() {
    return !!this.paintingData;
};

User.prototype.getPaintingStatistics = function() {
    const painting = this.getPainting();
    return painting ? painting.getStatistics() : null;
};

User.prototype.getPaintingData = function() {
    return this.getPaintingJSON();
};

User.prototype.setPaintingData = function(paintingData) {
    return this.setPainting(paintingData);
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
