export interface CallableFunc {
  (): any;
}

// USER
export interface UserInterface {
  id: number;
  role: string;
  email: string;
  name?: string;
}

export interface CreateUserInterface {
  email: string;
  password: string;
  role?: string;
}

export interface AdminUserInterface {
  id?: number;
  role: string;
  email: string;
}

export interface AdminEditUserInterface extends AdminUserInterface {
  id: number;
  password: string;
}

// TYPES
export interface TypeInterface {
  id: number;
  name: string;
  brands?: BrandInterface[];
}

// BRANDS
export interface BrandInterface {
  id: number;
  name: string;
}

// PRODUCTS
export interface ProductInfoInterface {
  id?: number;
  title: string;
  description: string | number;
  createdAt?: string;
  updatedAt?: string;
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

// RATING
export interface RatingInterface {
  id: number;
  productId: number;
  rate: number;
  updatedAt: string;
  createdAt: string;
  userId: number | null;
}

// ORDERS
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
export interface OrderItemInterface {
  id?: number;
  name: string;
  info: { title: string; description: string }[];
  price: number;
  quantity: number;
  product_id: number;
  brand_name: string;
  type_name: string;
}

export interface OrderModalBodyProps {
  order: OrderInterface | null;
  billing: BillingInterface | null;
}

// INVOICE
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

// BASKET
export interface BasketProductProps {
  product: ProductInterface;
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

// Router
export interface RouteInterface {
  path?: string | undefined;
  element?: React.ReactNode | null;
  private?: null | string;
  children?: RouteInterface[];
  errorElement?: React.ReactNode | null;
}
// BILLING
export interface BillingInterface {
  billing_bank_account: string;
  billing_fullname: string;
  billing_country: string;
  billing_index: string;
  billing_bank_name: string;
  billing_tax: string;
  billing_street: string;
  billing_bank_info: string;
  billing_city: string;
}

// CHARTS
export interface ChartProps {
  barColor: string;
  textColor: string;
  barsData: number[];
  barCategories: string[];
}
// Edit Delete table component
export interface EditDeleteTableProps {
  rows: any[];
  cols: { name: string; alias?: string; formatter?: any }[]; // name = 'order.invoice.id' will return id by getPropByString()
  onEdit(obj: object): void;
  onDelete(id: number): void;
}
