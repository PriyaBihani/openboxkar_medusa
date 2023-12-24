import { Order } from "src/models/order";
import { Product } from "src/models/product";
import OrderService from "../services/order";
import { SubscriberConfig, SubscriberArgs } from "@medusajs/medusa";
import OrderRepository from "../repositories/order";

// Associate store id with order
export default async function orderPlacedHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<Order>) {
  console.log("Order created", data);

  const orderService = container.resolve<OrderService>("orderService");

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "items.variant", "items.variant.product"],
  });

  order.store_id = order.items[0].variant.product.store_id;
  OrderRepository.update(order.id, order);
  //   const groupedItems = {};

  //   order.items.forEach((item) => {
  // const productId = item.variant.product_id;
  // order.store_id = item.variant.product.store_id;
  // order.store = item.variant.product.store;
  // if (!groupedItems[productId]) {
  //   groupedItems[productId] = [];
  // }
  // groupedItems[productId].push(item);
  //   });
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};
