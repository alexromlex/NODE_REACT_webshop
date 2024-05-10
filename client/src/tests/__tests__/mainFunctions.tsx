import * as React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

// import API mocking utilities from Mock Service Worker.
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getDateStart } from '../../common/utils';

jest.mock('@mui/x-charts', () => ({
  BarChart: jest.fn().mockImplementation(({ children }) => children),
}));

// test('demo', () => {
//   expect(true).toBe(true);
// });

describe('getDateStart', () => {
  it('3 month from 01.01.2024 => 01-12-11 => 10.01.2023', () => {
    expect(getDateStart(3, new Date('01.01.2024')).toLocaleString()).toBe(new Date('10.01.2023').toLocaleString());
  });
});
