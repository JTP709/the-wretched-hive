import { Cart, CartItem } from "../../models";

export enum CartItemActionType {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  CREATED = 'CREATED',
}

export interface GetCartResult extends Cart {
  items?: CartItem[]
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartProduct {
  id: number;
  quantity: number;
  product: Product;
}

export type Total = { total: number }
export type Data = GetCartResult | CartProduct[] | Total | CartItem

export type CartServiceResult = Promise<{
  type: CartItemActionType,
  message?: string,
  data?: Data,
}>