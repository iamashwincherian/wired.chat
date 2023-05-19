import { Sequelize } from "sequelize";

export default function connectDB() {
  const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
  });

  sequelize
    .authenticate()
    .then(() => console.log("📚 Connected to DB successfully!"))
    .catch((err) => console.log("Failed to connect to the DB!", err));
}
