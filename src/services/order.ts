import { Lifetime } from "awilix";
import {
  Cart,
  OrderService as MedusaOrderService,
  Order,
  Selector,
  User,
} from "@medusajs/medusa";
import { FindConfig } from "@medusajs/medusa";

type OrderSelector = {
  store_id?: string;
} & Selector<Order>;

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInUser_: User | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(
    selector: OrderSelector,
    config?: FindConfig<Order>
  ): Promise<Order[]> {
    if (!selector.store_id && this.loggedInUser_?.store_id) {
      selector.store_id = this.loggedInUser_.store_id;
    }
    config.select?.push("store_id");
    config.relations?.push("store");
    return await super.list(selector, config);
  }

  async retrieve(orderId: string, config?: FindConfig<Order>): Promise<Order> {
    config.relations = [...(config.relations || []), "store"];
    const order = await super.retrieve(orderId, config);

    if (
      order.store.id &&
      this.loggedInUser_?.store_id &&
      order.store_id !== this.loggedInUser_.store_id
    ) {
      throw new Error("Order does not belong to this store");
    }
    return order;
  }
  //   async createFromCart(cartOrId: string | Cart): Promise<Order> {

  //   }
}

export default OrderService;
