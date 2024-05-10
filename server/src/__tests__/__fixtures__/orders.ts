import { orderItemFixt } from './orderItems';

export const orderFixt = {
  id: 1,
  amount: 350000,
  shipping: '{"name":"standart","price":6500}"',
  payment: '{"name":"bank","price":0}',
  paid: false,
  status: 'new',
  userId: 2,
  item: [orderItemFixt, orderItemFixt],
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const orderUpdatedFixt = {
  id: 1,
  amount: 350000,
  shipping: '{"name":"standart","price":6500}"',
  payment: '{"name":"bank","price":0}',
  paid: false,
  status: 'cancelled',
  userId: 2,
  item: [orderItemFixt, orderItemFixt],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const newOrderReceivedParams = {
  basket_items: [{ id: 8, quantity: 1 }],
  amount: 43000,
  deliveryData: {
    country: 'Hungary',
    postcode: '123456',
    city: 'Budapest',
    street: 'My street',
    firstName: 'User',
    lastName: 'Tesztel',
    tel: '+36544878',
    delInfo: 'Please call me',
  },
  invoiceData: {
    country: 'Hungary',
    postcode: '123456',
    city: 'Budapest',
    street: 'My street',
    fullNameCompany: 'User Tesztel',
    tax: 'BNhg-442435',
  },
  shipping: { name: 'standart', price: 6500 },
  payment: { name: 'bank', price: 0 },
};

export const NewOrderGetAllProductsFixt = [
  {
    id: 8,
    name: 'WHIRLPOOL AKR 749/1 NB',
    price: 43000,
    img: 'WHIRLPOOL_AKR_749_1_NB_a59b816b-f20f-49b6-9dd0-4636f0b9099d.jpg',
    createdAt: '2024-04-23T09:58:58.030Z',
    updatedAt: '2024-04-23T09:58:58.030Z',
    typeId: 6,
    brandId: 2,
    info: [
      {
        title: 'Noise',
        description: '62 dB',
      },
    ],
    type: {
      name: 'Kitchen Hoods',
    },
    brand: {
      name: 'Whirlpool',
    },
  },
];

export const newOrderGetBasketFixt = {
  id: 20,
  temp: true,
  createdAt: '2024-04-18T06:43:08.470Z',
  updatedAt: '2024-04-18T06:43:08.470Z',
  userId: 2,
};

export const newOrderFixt = {
  id: 1,
  amount: 49500,
  shipping: '{"name":"standart","price":6500}"',
  payment: '{"name":"bank","price":0}',
  paid: false,
  status: 'new',
  userId: 2,
  items: [orderItemFixt],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const orderStatisticByStatusFixt = { '4': { new: 2 } };
export const orderStatisticAOVFixt = { '4': { orderQty: 2, sales: 700000, av: 350000 } };

export const orderStatisticBestSellersFixt = {
  products: { 'WHIRLPOOL AKR 749/1 NB': 4 },
  types: { 'Kitchen Hoods': 4 },
  brands: { Whirlpool: 4 },
};

export const orderCountByStatusFixt = [
  { status: 'new', count: 14 },
  { status: 'released', count: 1 },
];

export const orderStatisticCountByStatusFixt = { new: 14, released: 1 };

export const orderStatisticMonthlySalesFixt = [
  {
    month: '5',
    sum: '3363000',
  },
  {
    month: '4',
    sum: '7426883',
  },
];
