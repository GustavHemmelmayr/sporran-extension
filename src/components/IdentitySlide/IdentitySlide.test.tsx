import userEvent from '@testing-library/user-event';
import { browser } from 'webextension-polyfill-ts';

import {
  identitiesMock as identities,
  render,
  screen,
  waitForElementToBeRemoved,
} from '../../testing/testing';
import { saveIdentity } from '../../utilities/identities/identities';

import { IdentitySlide } from './IdentitySlide';
import { IdentitySlideNew } from './IdentitySlideNew';

jest.mock('../../utilities/identities/identities');
jest.spyOn(browser.runtime, 'sendMessage');

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentitySlide', () => {
  it('should render', async () => {
    const { container } = render(<IdentitySlide identity={identity} />);
    expect(container).toMatchSnapshot();
  });

  it('should enable editing the identity name', async () => {
    const { container } = render(<IdentitySlide identity={identity} options />);

    userEvent.click(await screen.findByLabelText('Identity options'));
    userEvent.click(
      await screen.findByRole('menuitem', { name: 'Edit Identity Name' }),
    );
    userEvent.type(await screen.findByLabelText('Identity name:'), ' Foo');

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    expect(saveIdentity).toHaveBeenCalledWith({
      name: 'KILT Identity 1 Foo',
      address: identity.address,
      did: identity.did,
      index: 1,
    });

    await waitForElementToBeRemoved(saveButton);

    expect(container).toMatchSnapshot();
  });
});

describe('IdentitySlideNew', () => {
  it('should render', async () => {
    const { container } = render(<IdentitySlideNew />);

    expect(container).toMatchSnapshot();
  });
});
