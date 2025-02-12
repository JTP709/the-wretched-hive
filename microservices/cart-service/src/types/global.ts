interface OrderInfo {
  name: string;
  email: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
  phone: string;
  total: number;
  userId: string;
}

interface PublishOrderInfo extends OrderInfo {
  cartId: number;
}
