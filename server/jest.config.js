module.exports = {
  maxWorkers: "75%",
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  // coverageReporters: [
  //   'clover',
  //   'json',
  //   'lcov',
  //   [
  //     'text',
  //     //  { skipFull: true }
  //   ],
  // ],

  collectCoverageFrom: [
    // 'src/**/*.ts', // - all
    'src/routes/*.ts', // - only routes
    // 'src/controllers/basketController.ts',   // In PROGRESS
    // 'src/controllers/productController.ts',  // In PROGRESS
    // 'src/controllers/userController.ts',     // In PROGRESS
  ],
  coveragePathIgnorePatterns: [
    'src/middleware',
    'src/types',
    'baseController.ts',
    'src/repositories/',
    'src/database/seed-db.ts',
    'src/index.ts',
    'src/routes/systemRouter.ts',
  ],
  // coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 20,
      functions: 30,
      lines: 50,
    },
    // './src/routes/': {
    //   branches: 100,
    //   functions: 100,
    //   statements: 100,
    //   lines: 100,
    // },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/src/__tests__/__fixtures__',
    '<rootDir>/src/__tests__/__mocks__',
  ],
  preset: 'ts-jest',
};
