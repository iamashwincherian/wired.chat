const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");
const Message = require("./Message");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null, // This will be removed in the migration
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM("local", "google", "github"),
      defaultValue: "local",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password && user.provider === "local") {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Instance method to check password
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
