export interface CallableFunc {
  (): any;
}

export interface TypeInterface {
  id: number;
  name: string;
  brands?: BrandInterface[];
}
export interface BrandInterface {
  id: number;
  name: string;
}

export interface ProductInfoInterface {
  id?: number;
  title: string;
  description: string | number;
}

export interface ProductInterface {
  id?: number;
  name: string;
  price: number;
  img: string | File | null;
  rating?: number;
  info?: ProductInfoInterface[];
  brandId?: number;
  typeId?: number;
  brand?: { id: number; name: string };
  type?: { id: number; name: string };
  quantity?: number;
}

export interface RatingInterface {
  id: number;
  productId: number;
  rate: number;
  updatedAt: string;
  createdAt: string;
  userId: number | null;
}

/* ORDERS */
export interface OrderItemInterface {
  name: string;
  info: { title: string; description: string }[];
  price: number;
  quantity: number;
  product_id: number;
  brand_name: string;
  type_name: string;
}

export interface InvoiceInteface {
  id: number;
  number: string;
  proforma: true;
  date: string;
  due_date: string;
  vat: number;
  seller: {
    name: string;
  };
  buyer: {
    country: string;
    postcode: string;
    city: string;
    street: string;
    fullNameCompany: string;
    tax?: string;
  };
  delivery: {
    country: string;
    postcode: string;
    city: string;
    street: string;
    firstName: string;
    lastName: string;
    tel: string;
    delInfo: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  orderId: number;
}

export interface OrderInterface {
  [x: string]: any;
  id: number;
  amount: number;
  payment: { name: string; price: number };
  shipping: { name: string; price: number };
  invoice: InvoiceInteface;
  item: OrderItemInterface[];
  status: 'new' | 'invoiced' | 'released' | 'fulfilled' | 'holded' | 'cancelled';
  paid: boolean;
  createdAt: string;
}

// Toasts
export interface ToastObjInterface {
  id: string;
  style: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  delay: number;
  title: string;
  body: string | JSX.Element;
  time?: string;
}
