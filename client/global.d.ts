interface ProductBase {
  name: string;
  category: string;
  description: string;
  price: number;
}
interface Product extends ProductBase {
  id: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
  productId: number;
  product: ProductBase;
}

type GetCartResponse = {
  id: number,
  productId: number,
  quantity: number,
}

type User = {
  username: string;
}

interface SignUpFormRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
}

interface SignUpForm extends SignUpFormRequest {
  passwordVerify: string;
};