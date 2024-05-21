import { makeAutoObservable } from 'mobx';
import { ProductInterface } from '../common/types';
import { addToBasket, deleteFromBasket, emptyBasket, getBasket } from '../api/basketApi';

class BasketStore {
  _basket: Map<number, ProductInterface & { quantity: number }>;
  _shippingFees: number;

  constructor() {
    makeAutoObservable(this);
    this._basket = new Map();
    this._shippingFees = 6500;
  }

  get shippingFees() {
    if (this.basket.length === 0) return 0;
    return this._shippingFees;
  }

  get basketProductQuantity() {
    let q = 0;
    if (this._basket.size === 0) return 0;
    for (const el of this._basket.values()) {
      q += el.quantity;
    }
    return q;
  }

  get basket() {
    return Array.from(this._basket.values());
  }

  getBasketProduct(id: number) {
    return this._basket.get(id);
  }

  setBasketProduct(id: number, product: ProductInterface & { quantity: number }) {
    return this._basket.set(id, product);
  }
  deleteBasketProduct(id: number) {
    this._basket.delete(id);
  }

  get basketTotalPrice() {
    const a = Array.from(this._basket.values());
    if (!a.length) return 0;
    // ;
    return a.reduce((a, b) => a + Number(b.quantity * b.price), 0);
  }

  setEmptyBasket() {
    this._basket.clear();
  }

  *emptyBasket() {
    const resp = yield emptyBasket();
    if (resp.status === 200) this._basket.clear();
  }

  async addToBasket(product: ProductInterface, quantity: number) {
    const resp = await addToBasket(product.id!, quantity);
    if (resp.status && resp.status === 200 && resp.data) {
      const p = this.getBasketProduct(product.id!);
      if (!p) {
        this.setBasketProduct(product.id!, { ...product, quantity: quantity });
      } else {
        this.setBasketProduct(product.id!, { ...product, quantity: p.quantity + quantity });
      }
      return true;
    }
    return false;
  }

  *deleteFromBasket(product: ProductInterface, quantity: number) {
    if (!product) return;
    yield deleteFromBasket(product.id!, quantity).then((resp) => {
      if (resp.status && resp.status === 200) {
        const p = this.getBasketProduct(product.id!);
        if (!p) return;
        if (quantity >= p.quantity) {
          this.deleteBasketProduct(product.id!);
        } else {
          this.setBasketProduct(product.id!, { ...product, quantity: p.quantity - quantity });
        }
      }
    });
  }

  *getBasket(userId: number | undefined = undefined, productId: number | undefined = undefined) {
    const { counts, products } = yield getBasket(userId, productId);
    if (!products) return;
    products.forEach((el: ProductInterface) => {
      this._basket.set(el.id!, { ...el, quantity: counts[el.id!] });
    });
  }
}
export default new BasketStore();
