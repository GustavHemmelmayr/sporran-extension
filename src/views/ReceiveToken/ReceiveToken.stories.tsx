import { Meta } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

export default {
  title: 'Views/ReceiveToken',
  component: ReceiveToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/receive',
      ]}
    >
      <Routes>
        <Route
          path={paths.identity.receive}
          element={
            <ReceiveToken
              identity={
                identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
              }
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/receive']}>
      <Routes>
        <Route
          path={paths.identity.receive}
          element={<ReceiveToken identity={NEW} />}
        />
      </Routes>
    </MemoryRouter>
  );
}
