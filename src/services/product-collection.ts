import { Lifetime } from "awilix";
import {
  ProductCollectionService as MedusaProductCollectionService,
  ProductCollection,
  User,
} from "@medusajs/medusa";
import {
  CreateProductCollection,
  UpdateProductCollection,
} from "@medusajs/medusa/dist/types/product-collection";

class ProductCollectionService extends MedusaProductCollectionService {
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

  async create(
    collection: CreateProductCollection
  ): Promise<ProductCollection> {
    console.log(
      "HERE ========= inside the create method of collection service"
    );
    try {
      if (this.loggedInUser_?.store_id) {
        throw new Error("You are not allowed to create product collections");
      }
      return await super.create(collection);
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    collectionId: string,
    update: UpdateProductCollection
  ): Promise<ProductCollection> {
    try {
      if (this.loggedInUser_?.store_id) {
        throw new Error("You are not allowed to create product collections");
      }
      return await super.update(collectionId, update);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(collectionId: string): Promise<void> {
    if (this.loggedInUser_?.store_id) {
      throw new Error("You are not allowed to delete product collections");
    }
    await super.delete(collectionId);
  }
}

/* DISCUSSION POINT
    It needs to be discuesed whether a vendor can add product to a collection or not.
 */

export default ProductCollectionService;
