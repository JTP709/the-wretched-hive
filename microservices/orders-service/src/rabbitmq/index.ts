import amqp from "amqplib";
import { Order } from "../models";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const ORDER_QUEUE = "order_queue";

export const startOrderConsumer = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(ORDER_QUEUE, { durable: true });

  console.log("Orders Service: Waiting for order messages...");
  channel.consume(
    ORDER_QUEUE,
    async (msg) => {
      if (msg) {
        try {
          const orderData = JSON.parse(msg.content.toString());
          console.log("Orders Service: Received order:", orderData);
          await Order.create(orderData);
          channel.ack(msg);
        } catch (err) {
          console.error("Error processing order message:", err);
          channel.nack(msg);
        }
      }
    },
    { noAck: false }
  )
}