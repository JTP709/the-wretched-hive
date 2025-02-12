import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672/";
const ORDER_QUEUE = "order_queue";

export const publishOrderMessage = async (orderInfo: OrderInfo) => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(ORDER_QUEUE, { durable: true });

  channel.sendToQueue(ORDER_QUEUE, Buffer.from(JSON.stringify(orderInfo)), {
    persistent: true,
  });
  console.log("Published order message:", orderInfo);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
};
