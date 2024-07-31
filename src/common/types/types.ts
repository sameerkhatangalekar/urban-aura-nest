import { CartItem } from '@prisma/client';

export type CartItemWithProduct = CartItem & {
  product: {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    images: string[];
    discount: number;
    rating: number;
  };
};

export type CartItemsReturnType = { cart: CartItemWithProduct[]; cartTotal: number };

export type SuccessType = {
  message: string;
};
