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

// (property) cart: ({
//   product: {
//       id: string;
//       name: string;
//       brand: string;
//       description: string;
//       price: number;
//       images: string[];
//       discount: number;
//       rating: number;
//   };
// } & {
//   id: string;
//   quantity: number;
//   color: string;
//   size: $Enums.Size;
//   userId: string;
//   productId: string;
//   createdAt: Date;
//   updatedAt: Date;
// })[]

export type CartItemsReturnType = { cart: CartItemWithProduct[]; cartTotal: number };
