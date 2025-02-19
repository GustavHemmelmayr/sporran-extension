import BN from 'bn.js';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getDeposit, getFee } from '../../utilities/didDowngrade/didDowngrade';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUrl } from '../../utilities/did/did';

import { DidDowngrade } from './DidDowngrade';

jest.mock('../../utilities/didDowngrade/didDowngrade', () => ({
  getFee: jest.fn(),
  getDeposit: jest.fn(),
}));
jest.mocked(getFee).mockResolvedValue(new BN(1e13));
jest.mocked(getDeposit).mockResolvedValue(new BN(1e15));

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUrl).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUrl>);

describe('DidDowngrade', () => {
  it('should render', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngrade
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
