export default {
  // globals: {
  //   'ts-jest': {
  //     diagnostics: false,
  //   },
  // },
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { diagnostics: false }],
  },
  rootDir: 'src',
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
    '^@app/(.*)$': '<rootDir>/$1',
    '\\.(css)$': 'identity-obj-proxy',
  },
  coveragePathIgnorePatterns: ['./build/', './node_modules/', '<rootDir>/node_modules/', 'node_modules/'],
  transformIgnorePatterns: ['/node_modules/(?!@mui/x-charts/BarChart)'],
};
