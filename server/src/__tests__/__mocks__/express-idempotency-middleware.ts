export const idempotencyMiddleware = () => {
  return (req: any, res: any, next: any) => {
    console.log('>>> MOCK idempotencyMiddleware called!')
    next();
  };
};

export const MemoryStore = class {
  constructor() {}
};