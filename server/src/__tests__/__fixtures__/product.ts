import path from 'path';
import { productInfoFixt } from './productInfo';

export const productFixt = {
  id: 1,
  name: 'FREEZER 54545885ED',
  price: 150000,
  img: 'FREEZER_54545885ED_933d0a1f-332e-453b-ba1f-1af99570dfbe.jpg',
  brandId: 1,
  typeId: 1,
  info: [productInfoFixt, productInfoFixt],
  rating: 4.5,
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON: function () {
    return this;
  },
};

export const productImagePath = path.resolve(path.resolve(__dirname), '../../../static', 'testImage.jpg');

export const productUpdatedFixt = {
  id: 1,
  name: 'UPDATED PRODUCT NAME',
  price: 150000,
  img: 'UPDATED_PRODUCT_NAME_image.jpg',
  brandId: 1,
  typeId: 1,
  info: [productInfoFixt, productInfoFixt],
  rating: 4.5,
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON: function () {
    return this;
  },
};
