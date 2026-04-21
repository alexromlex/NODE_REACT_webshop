
import BasketStore from "./basketStore";
import MainStore from "./mainStore";
import OrderStore from "./orderStore";
import ProductStore from "./productStore";
import UserStore from "./userStore";
import AdminStore from "./adminStore";

interface StoreRegistryInterface {
  registerStore: (storeName: string, factory: () => any, options?: Record<string, any>) => void;
  createStore: (storeName: string, deps: Record<string, any>) => any;
  getRegisteredStores: () => string[];
}

class StoreRegistry implements StoreRegistryInterface {

  factories: Map<string, { factory: () => any, options: Record<string, any> }>;
  
  constructor() {
    this.factories = new Map();
  }
  
  registerStore(storeName: string, factory: () => any, options: Record<string, any> = {}) {
    this.factories.set(storeName, { factory, options });
  }
  
  createStore(storeName: string, deps: Record<string, any> = {}) {
    const entry = this.factories.get(storeName);
    if (!entry) throw new Error(`Store ${storeName} not registered`);
    console.log(`Creating store: ${storeName}`);
    return entry.factory(deps);
  }
  
  getRegisteredStores() {
    return Array.from(this.factories.keys());
  }
}

export const registry = new StoreRegistry();

registry.registerStore('basketStore', () => new BasketStore());
registry.registerStore('mainStore', () => new MainStore());
registry.registerStore('orderStore', () => new OrderStore());
registry.registerStore('productStore', () => new ProductStore());
registry.registerStore('userStore', () => new UserStore());
registry.registerStore('adminStore', () => new AdminStore());
// registry.register('chatStore', (deps) => new ChatStore(deps.userStore), {
//   dependencies: ['userStore']
// });