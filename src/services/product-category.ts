import { Lifetime } from "awilix";
import {
  ProductCategoryService as MedusaProductCategoryService,
  ProductCategory,
  User,
} from "@medusajs/medusa";
import {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
} from "@medusajs/medusa/dist/types/product-category";

class ProductCategoryService extends MedusaProductCategoryService {
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
    productCategoryInput: CreateProductCategoryInput
  ): Promise<ProductCategory> {
    console.log("HERE ========= inside the create method of category service");
    try {
      if (this.loggedInUser_?.store_id) {
        throw new Error("You are not allowed to create product categories");
      }
      return await super.create(productCategoryInput);
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    productCategoryId: string,
    productCategoryInput: UpdateProductCategoryInput
  ): Promise<ProductCategory> {
    console.log("HERE ========= inside the update method of category service");

    if (this.loggedInUser_?.store_id) {
      throw new Error("You are not allowed to update product categories");
    }

    return await super.update(productCategoryId, productCategoryInput);
  }

  async delete(productCategoryId: string): Promise<void> {
    console.log("HERE ========= inside the delete method of category service");
    if (this.loggedInUser_?.store_id) {
      throw new Error("You are not allowed to delete product categories");
    }

    await super.delete(productCategoryId);
  }

  /* Performing reordering of categories and shifting siblings in categories require updating
     the categories so it automatically not allow for non-admin users to perform these actions.
     That is why we are not overriding these methods.
*/

  /** DISCUSSION POINT
   * It needs to be discuss whether a vendow can add product to a category or not.
   */
}

export default ProductCategoryService;
