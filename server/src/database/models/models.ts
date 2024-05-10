import sequelize from '../connect';
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  HasManyGetAssociationsMixin,
  ForeignKey,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

export interface UserInterface extends Model<InferAttributes<UserInterface>, InferCreationAttributes<UserInterface>> {
  id: CreationOptional<number>;
  email: string;
  password: string;
  role: string;
}

const User = sequelize.define<UserInterface>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, validate: { isEmail: { msg: 'Email not valid!' } } },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

export interface BasketInterface
  extends Model<InferAttributes<BasketInterface>, InferCreationAttributes<BasketInterface>> {
  id: CreationOptional<number>;
  temp: boolean;
  userId?: CreationOptional<number>;
}

const Basket = sequelize.define<BasketInterface>('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  temp: { type: DataTypes.BOOLEAN, defaultValue: false },
  // userId: { type: DataTypes.INTEGER },
});

export interface OrderInterface
  extends Model<InferAttributes<OrderInterface>, InferCreationAttributes<OrderInterface>> {
  id: CreationOptional<number>;
  amount: number;
  shipping: string;
  payment: string;
  paid: boolean;
  status: string;
  userId?: CreationOptional<number>;
  item?: NonAttribute<OrderItemInterface[]>;
}

const Order = sequelize.define<OrderInterface>('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.BIGINT, allowNull: false },
  shipping: { type: DataTypes.JSON, allowNull: false },
  payment: { type: DataTypes.JSON, allowNull: false },
  paid: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'new' }, // new, invoiced, released, fulfilled, holded, cancelled
});

export interface OrderItemInterface
  extends Model<InferAttributes<OrderItemInterface>, InferCreationAttributes<OrderItemInterface>> {
  id: CreationOptional<number>;
  name: string;
  info: string;
  price: number;
  quantity: number;
  product_id: number;
  type_name: string;
  brand_name: string;
}

const OrderItem = sequelize.define<OrderItemInterface>('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  info: { type: DataTypes.JSON, allowNull: true },
  price: { type: DataTypes.BIGINT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // copy of productId
  type_name: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'underfined' },
  brand_name: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'underfined' },
});

export interface InvoiceInterface
  extends Model<InferAttributes<InvoiceInterface>, InferCreationAttributes<InvoiceInterface>> {
  id: CreationOptional<number>;
  number: string;
  proforma: boolean;
  date: string;
  due_date: Date;
  vat: number;
  seller: string;
  buyer: string;
  delivery: string;
  status: string; // pending, paid, canceled
}

const Invoice = sequelize.define<InvoiceInterface>('invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  number: { type: DataTypes.STRING, allowNull: false, defaultValue: DataTypes.UUIDV4 },
  proforma: { type: DataTypes.BOOLEAN, defaultValue: true },
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  vat: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 27 },
  seller: { type: DataTypes.JSON, allowNull: false },
  buyer: { type: DataTypes.JSON, allowNull: false },
  delivery: { type: DataTypes.JSON, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }, // pending, paid, canceled
});

export interface ProductInterface
  extends Model<InferAttributes<ProductInterface>, InferCreationAttributes<ProductInterface>> {
  id: CreationOptional<number>;
  name: string;
  price: number;
  img: string;
  brandId?: ForeignKey<number>;
  typeId?: ForeignKey<number>;
  info?: NonAttribute<ProductInfoInterface[]>;
  rating?: NonAttribute<number>;
  ratings?: NonAttribute<RatingInterface[]>;
  getRating?: HasManyGetAssociationsMixin<RatingInterface>;
}
const Product = sequelize.define<ProductInterface>('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    // notEmpty: true,
    validate: {
      notEmpty: { msg: "Name can't be empty!" },
      notNull: { msg: "Name can't be Null!" },
    },
  },
  price: { type: DataTypes.BIGINT, allowNull: false },
  img: { type: DataTypes.STRING },
});

export interface ProductInfoInterface
  extends Model<InferAttributes<ProductInfoInterface>, InferCreationAttributes<ProductInfoInterface>> {
  id: CreationOptional<number>;
  title: string;
  description: number;
  productId?: CreationOptional<number>;
}
const ProductInfo = sequelize.define<ProductInfoInterface>('product_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

export interface TypeInterface
  extends Model<InferAttributes<TypeInterface>, InferCreationAttributes<TypeInterface, { omit: 'id' }>> {
  id: CreationOptional<number>;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  brands?: NonAttribute<BrandInterface[]>;
}
const Type = sequelize.define<TypeInterface>('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    // notEmpty: true,
    validate: {
      notEmpty: { msg: "Name can't be empty!" },
      notNull: { msg: "Name can't be Null!" },
    },
  },
});

export interface BrandInterface
  extends Model<InferAttributes<BrandInterface>, InferCreationAttributes<BrandInterface>> {
  id: CreationOptional<number>;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  types?: NonAttribute<TypeInterface[]>;
}
const Brand = sequelize.define<BrandInterface>('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    // notEmpty: true,
    validate: {
      notEmpty: { msg: "Name can't be empty!" },
      notNull: { msg: "Name can't be Null!" },
    },
  },
});

export interface RatingInterface
  extends Model<InferAttributes<RatingInterface>, InferCreationAttributes<RatingInterface>> {
  id: CreationOptional<number>;
  rate: number;
  productId?: CreationOptional<number>;
  userId?: CreationOptional<number>;
}
const Rating = sequelize.define<RatingInterface>('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.FLOAT, allowNull: false },
});

export interface BasketProductInterface
  extends Model<InferAttributes<BasketProductInterface>, InferCreationAttributes<BasketProductInterface>> {
  id: CreationOptional<number>;
  basketId?: CreationOptional<number>;
  productId?: CreationOptional<number>;
}
const BasketProduct = sequelize.define<BasketProductInterface>('basket_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

interface TypeBrandInterface
  extends Model<InferAttributes<TypeBrandInterface>, InferCreationAttributes<TypeBrandInterface>> {
  typebrandId: CreationOptional<number>;
}

const TypeBrand = sequelize.define<TypeBrandInterface>(
  'type_brand',
  {
    typebrandId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

export interface SettingsInterface
  extends Model<InferAttributes<SettingsInterface>, InferCreationAttributes<SettingsInterface>> {
  name: string;
  value: string;
}

const Settings = sequelize.define<SettingsInterface>('settings', {
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.TEXT },
});

User.hasOne(Basket);
User.hasMany(Rating);
User.hasMany(Order);
User.hasMany(Invoice);

Order.belongsTo(User);
Order.hasMany(OrderItem, { onDelete: 'CASCADE', as: 'item' });
Order.hasOne(Invoice);

OrderItem.belongsTo(Order);

Invoice.belongsTo(Order);

Basket.hasMany(BasketProduct);
Basket.belongsTo(User);

Rating.belongsTo(Product, { onDelete: 'CASCADE' });
Rating.belongsTo(User, { onDelete: 'CASCADE' });

BasketProduct.belongsTo(Basket);
BasketProduct.belongsTo(Product);

Type.hasMany(Product);
Type.belongsToMany(Brand, { through: TypeBrand });

Brand.hasMany(Product);
Brand.belongsToMany(Type, { through: TypeBrand });

Product.hasMany(Rating);
Product.hasMany(ProductInfo, { onDelete: 'CASCADE', as: 'info' });
Product.hasMany(BasketProduct);
Product.belongsTo(Type);
Product.belongsTo(Brand);

ProductInfo.belongsTo(Product);

export {
  User,
  Product,
  Basket,
  BasketProduct,
  Brand,
  Rating,
  Type,
  ProductInfo,
  TypeBrand,
  Order,
  OrderItem,
  Invoice,
  Settings,
};
