import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { registry } from './StoreRegistry';

const StoreContext = createContext(null);

interface StoreProviderInterface{
  children: any;
}

export const StoreProvider: React.FC<StoreProviderInterface> = ({ children }) => {

  const storesRef = useRef(new Map());
  
  const getStore = useCallback((storeName: string) => {
    if (storesRef.current.has(storeName)) {
      return storesRef.current.get(storeName);
    }
    
    const deps = {};
    const entry = registry.factories.get(storeName);
    if (entry?.options.dependencies) {
      entry.options.dependencies.forEach(depName => {
        deps[depName] = getStore(depName);
      });
    }
    
    const store = registry.createStore(storeName, deps);
    storesRef.current.set(storeName, store);
    
    return store;
  }, []);

  const unloadStore = useCallback((storeName: string) => {
    const store = storesRef.current.get(storeName);
    if (store?.onCleanup) store.onCleanup();
    storesRef.current.delete(storeName);
    console.log(`Store: ${storeName} deleted!`);
  }, []);
  
  const contextValue = useMemo(() => ({ getStore, unloadStore }), [getStore, unloadStore]);
  
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};


export const useStore = (storeName) => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  
  return useMemo(() => context.getStore(storeName), [context, storeName]);
};

// Удобные хуки
// export const useUserStore = () => useStore('userStore');
// export const useChatStore = () => useStore('chatStore');