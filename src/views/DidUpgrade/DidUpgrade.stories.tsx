import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { DidUpgrade } from './DidUpgrade';

export default {
  title: 'Views/DidUpgrade',
  component: DidUpgrade,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/did/upgrade/sign',
      ]}
    >
      <Route path={paths.identity.did.upgrade.sign}>
        <DidUpgrade
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
