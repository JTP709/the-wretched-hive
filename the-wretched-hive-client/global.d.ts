interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
  productId: number;
}

type GetCartResponse = {
  id: number,
  productId: number,
  quantity: number,
}
