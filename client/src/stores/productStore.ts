import { makeAutoObservable } from 'mobx';
import { BrandInterface, ProductInterface, TypeInterface } from '../common/types';
import { getProducts } from '../api/productsApi';

class ProductStore {
  _types: TypeInterface[];
  _brands: BrandInterface[];
  _products: ProductInterface[];
  _selectedType: TypeInterface | null;
  _selectedBrand: BrandInterface | null;
  _page: number;
  _total_pages: number;
  _limit_pages: number;
  _sort: [string, string];
  _v: string | null;

  _searchType: string | null;

  constructor() {
    makeAutoObservable(this);
    this._selectedType = null;
    this._selectedBrand = null;
    this._types = [];
    this._brands = [];
    this._products = [];
    this._page = 1;
    this._total_pages = 1;
    this._limit_pages = 6;
    this._searchType = null;
    this._sort = ['updatedAt', 'DESC']; // ASC | DESC
    this._v = null;
  }

  setSearchSort(v: [string, string]) {
    this._sort = v;
  }

  setSearchType(t: string | null) {
    this._searchType = t;
  }

  setPage(p: number) {
    this._page = p;
  }
  setTotalPages(p: number) {
    this._total_pages = p;
  }

  setTypes(data: TypeInterface[]) {
    this._types = data;
  }
  setSelectedType(data: TypeInterface | null) {
    this._selectedType = data;
  }
  setBrands(data: BrandInterface[]) {
    this._brands = data;
  }
  setSelectedBrand(data: BrandInterface | null) {
    this._selectedBrand = data;
  }
  setProducts(data: ProductInterface[]) {
    this._products = data;
  }

  setV(v: string) {
    this._v = v;
  }

  get searchType() {
    return this._searchType;
  }

  get page() {
    return this._page;
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
  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get products() {
    return this._products;
  }

  get v() {
    return this._v;
  }

  get sort() {
    return this._sort;
  }
}

export default new ProductStore();
