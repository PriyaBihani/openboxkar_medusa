import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";
import { Store } from "./store";

@Entity()
export class User extends MedusaUser {
  @Index("UserStoreId")
  @Column({ nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;
}

/*

{
  "user": {
    "email": "vendor@email.com",
    "store_id": "store_01HHVR3G462246TYY693TTVHG6",
    "id": "usr_01HHVR3G52T7AWZ6MTYFK7DGTH",
    "deleted_at": null,
    "role": "member",
    "first_name": null,
    "last_name": null,
    "api_token": null,
    "metadata": null,
    "created_at": "2023-12-17T11:20:41.348Z",
    "updated_at": "2023-12-17T11:20:41.348Z"
  }
}
*/
