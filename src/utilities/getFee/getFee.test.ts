import BN from 'bn.js';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Keyring } from '@polkadot/keyring';

import { makeKeyring } from '../identities/identities';

import { getFee } from './getFee';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
}));
jest.mock('../../utilities/identities/identities');

describe('getFee', () => {
  it('should respond with fee to the proper messages', async () => {
    const txMock = {
      toHex() {
        return 'hex transaction';
      },
    };
    const infoMock = {
      partialFee: {
        toString() {
          return 'partial fee';
        },
      },
    };
    const apiMock = {
      tx: { balances: { transfer: jest.fn().mockReturnValue(txMock) } },
      rpc: { payment: { queryInfo: jest.fn().mockResolvedValue(infoMock) } },
    };

    const signedTxMock = {
      toHex() {
        return 'Signed tx hash';
      },
    };
    const blockchainMock = {
      api: apiMock,
      signTx: jest.fn().mockResolvedValue(signedTxMock),
    };

    (
      BlockchainApiConnection.getConnectionOrConnect as jest.Mock
    ).mockResolvedValue(blockchainMock);

    const identityMock = { Alice: true };
    jest.mocked(makeKeyring).mockReturnValue({
      createFromUri: () => identityMock,
    } as unknown as Keyring);

    const fee = await getFee({
      recipient: 'address',
      amount: new BN(125000000),
      tip: new BN(250000),
    });

    expect(fee.toString()).toEqual('partial fee');
    expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();

    const transfer = apiMock.tx.balances.transfer;
    expect(transfer).toHaveBeenCalledWith('address', expect.anything());

    const args = jest.mocked(transfer).mock.calls?.[0];
    expect(args?.[1]?.toString(10)).toEqual('125000000');

    expect(blockchainMock.signTx).toHaveBeenCalledWith(
      identityMock,
      txMock,
      expect.anything(),
    );
    expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
      'Signed tx hash',
    );
  });
});
