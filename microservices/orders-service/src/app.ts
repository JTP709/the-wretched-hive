import sequelize from "./models";
import { startOrderConsumer } from "./rabbitmq";

const onShutdown = async () => {
  try {
    await sequelize.close();
    console.log("Closed the database connection successfully");
  } catch (err) {
    console.error("Error closing the database connection", err);
  } finally {
    process.exit();
  }
};

(async function Main() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      // await sequelize.sync({ alter: true });
      // use if error occurs WARNING: this will delete all data
      // await sequelize.sync({ force: true });
      console.log("All models were synchronized successfully");
    }

    process.on("SIGINT", onShutdown);
    process.on("SIGTERM", onShutdown);

    startOrderConsumer();
  } catch (err) {
    console.error("An error occurred while starting the application", err);
  }
})();
