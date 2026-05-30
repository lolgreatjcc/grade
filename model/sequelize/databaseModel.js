const { Sequelize, DataTypes } = require('sequelize');
const uuid = require('uuid');
const uuidv7 = uuid.v7;

// Please define your details in the .env file
// that should be at the top level (same as app.js)

const database = 'grade';
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;

const sequelize = new Sequelize({
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    },
    dialectOptions: process.env.NODE_ENV === 'staging' ? {
        ssl: {
            require: true
        }
    } : {},
    ssl: process.env.NODE_ENV ==='staging' ? true : false,
    database: database,
    username: username,
    password: password,
    host: host,
    port: 5432,
    clientMinMessages: 'notice',
});

// Checks Connection to Database
const checkDBConnection = (async () => {
    try {
        await sequelize.authenticate();
        console.log("Sequelize established connection with database successfully");
    } catch (error) {
        console.error("Unable to connect to the database", error);
}});
if (process.env.DB_IGNORED != 'true') checkDBConnection();
else console.log("db is being ignored");

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        allowNull: false,
        primaryKey: true
    },
    user_username: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    user_password: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    user_creation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    user_google_sso: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_oas_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_google_drive: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
})

const Attempt = sequelize.define('Attempt', {
    attempt_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    answer_key_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    attempt_file_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    attempt_score: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    attempt_max_possible: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    attempt_creation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
})

const AnswerKey = sequelize.define('AnswerKey', {
    answer_key_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    answer_key_file_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
})

AnswerKey.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(AnswerKey, { foreignKey: 'user_id' });

Attempt.belongsTo(AnswerKey, { foreignKey: 'answer_key_id' });
AnswerKey.hasOne(Attempt, { foreignKey: 'answer_key_id' });

module.exports = sequelize;
