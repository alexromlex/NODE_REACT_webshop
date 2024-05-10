import { makeAutoObservable} from 'mobx';
import { createType, deleteType, updateType } from '../api/typesApi';
import { BrandInterface, ProductInterface, TypeInterface, OrderInterface } from '../common/types';
import { deleteBrand, createBrand, updateBrand } from '../api/brandsApi';
import { deleteUser, createUser, updateUser, getUsers } from '../api/userApi';
import { getAllOrder, updateOrder } from '../api/orderApi';
import { getSettings, updateSettings } from '../api/settingsApi';

export interface AdminUserInterface {
  id?: number;
  role: string;
  email: string;
}

export interface AdminEditUserInterface {
  id: number;
  role: string;
  email: string;
  password: string;
}

class AdminStore {
  _types: TypeInterface[];
  _brands: BrandInterface[];
  _users: AdminUserInterface[];
  _products: ProductInterface[];
  _orders: OrderInterface[];
  _selectedType: TypeInterface | null;
  _selectedBrand: BrandInterface | null;
  _page: number;
  _total_pages: number;
  _limit_pages: number;
  _settings;
  _sort: [string, string];
  _v: string | null;

  constructor() {
    makeAutoObservable(this);
    this._types = [];
    this._brands = [];
    this._users = [];
    this._products = [];
    this._page = 1;
    this._total_pages = 1;
    this._limit_pages = 6;
    this._selectedType = null;
    this._selectedBrand = null;
    this._v = null;
    this._sort = ['updatedAt', 'DESC'];
    this._orders = [];
    this._settings = {
      general_terms: '',
      privacy_policy: '',
      header_img: '',
      header_name: '',
      billing_fullname: '',
      billing_country: '',
      billing_index: '',
      billing_city: '',
      billing_street: '',
      billing_tax: '',
      billing_bank_name: '',
      billing_bank_account: '',
      billing_bank_info: '',
    };
  }

  get settings() {
    return this._settings;
  }

  get orders() {
    return this._orders;
  }

  get types() {
    return this._types;
  }

  get brands() {
    return this._brands;
  }
  get users() {
    return this._users;
  }

  get products() {
    return this._products;
  }

  get page() {
    return this._page;
  }

  get sort() {
    return this._sort;
  }

  get total_pages() {
    return this._total_pages;
  }

  get limit_pages() {
    return this._limit_pages;
  }

  get selectedType() {
    return this._selectedType;
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  setSettings(v) {
    this._settings = v;
  }

  setSelectedType(type: TypeInterface | null) {
    // console.log('[setSelectedType] called!');
    this._selectedType = type;
  }

  setSelectedBrand(brand: BrandInterface | null) {
    this._selectedBrand = brand;
  }

  setV(v: string) {
    this._v = v;
  }

  setPage(p: number) {
    this._page = p;
  }
  setTotalPages(p: number) {
    this._total_pages = p;
  }
  setLimitPages(p: number) {
    this._limit_pages = p;
  }
  setProducts(products: ProductInterface[]) {
    this._products = products;
  }

  setBrands(brands: BrandInterface[]) {
    this._brands = brands;
  }

  setTypes(types: TypeInterface[]) {
    this._types = types;
  }

  setUsers(users: AdminUserInterface[]) {
    this._users = users;
  }

  setOrders(orders: OrderInterface[]) {
    this._orders = orders;
  }

  async getSettings() {
    // console.log('[getSettings] called!');
    return await getSettings();
  }

  *updateSettings(settings: { name: string; value: string }[]) {
    // console.log('[updateSettings] called!');
    try {
      const resp = yield updateSettings(settings);
      // console.log('resp: ', resp);
    } catch (error) {
      console.log(error);
    }
  }

  *fetchOrders(params = null) {
    try {
      const resp = yield getAllOrder(params);
      if (resp.status === 200) this.setOrders(resp.data);
      // console.log('ORDERS: ', resp.data);
      return resp;
    } catch (error) {
      console.error(error);
    }
  }

  deleteProduct(id: number) {
    this._products = this._products.filter((t) => t.id !== id);
  }
  addNewProduct(product: ProductInterface) {
    this._products.unshift(product);
  }

  updateProduct(product: ProductInterface) {
    this.updateArray(this._products, { id: product.id, ...product });
  }

  *updateOrder(id: number, values: { status: string }) {
    try {
      const res = yield updateOrder(id, values);
      if (res.status === 200) this.updateArray(this._orders, { id: id, ...res.data });
      return res;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  *fetchUsers() {
    yield getUsers()
      .then((data) => {
        this.setUsers(data);
      })
      .catch((e) => console.log(e));
  }

  *deleteUser(id: number) {
    try {
      const resp = yield deleteUser(id);
      this._users = this._users.filter((t) => t.id !== id);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *createUser(data: AdminUserInterface) {
    try {
      const resp = yield createUser(data);
      // console.log('createUser resp: ', resp);
      this._users.unshift(resp.data.user);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *updateUser(id: number, values) {
    try {
      const res = yield updateUser(id, values);
      this.updateArray(this._users, { id: id, ...values });
      return res;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  *deleteBrand(id: number) {
    try {
      const resp = yield deleteBrand(id);
      this._brands = this._brands.filter((t) => t.id !== id);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *createBrand(name: string) {
    try {
      const resp = yield createBrand(name);
      this._brands.unshift(resp.data);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *updateBrand(id: number, values) {
    try {
      const res = yield updateBrand(id, values);
      this.updateArray(this._brands, { id: id, ...values });
      return res;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  *deleteType(id: number) {
    try {
      const resp = yield deleteType(id);
      this._types = this._types.filter((t) => t.id !== id);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *createType(name: string, brands: string[]) {
    try {
      const resp = yield createType(name, brands);
      this._types.unshift(resp.data);
      return resp;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  *updateType(id: number, name: string, brands: number[]) {
    try {
      const res = yield updateType(id, name, brands);
      this.updateArray(this._types, { id, name });
      return res;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
  updateArray(array, item) {
    const indx = array.findIndex((i) => i.id === item.id, -1);
    if (indx > -1) {
      return (array[indx] = { ...array[indx], ...item });
    }
  }
}

export default new AdminStore();
