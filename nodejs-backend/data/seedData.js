const User = require('../models/User');

const seedUsers = [
    {
        username: 'admin',
        password: 'admin123',
    },
    {
        username: 'artist1',
        password: 'test123',
    },
    {
        username: 'painter2',
        password: 'painter123',
    }
];

const seedData = async () => {
    try {
        await User.destroy({ where: {} });

        console.log('🧹 Cleared existing data');

        const users = await User.bulkCreate(seedUsers, {
            individualHooks: true
        });
        console.log('👥 Created seed users');

        console.log('🌱 Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

module.exports = seedData;
