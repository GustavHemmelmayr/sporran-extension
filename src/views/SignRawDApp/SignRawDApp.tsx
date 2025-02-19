import { useCallback, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { u8aToHex } from '@polkadot/util';

import * as styles from './SignRawDApp.module.css';

import {
  decryptIdentity,
  useIdentities,
} from '../../utilities/identities/identities';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { useCopyButton } from '../../components/useCopyButton/useCopyButton';
import { Avatar } from '../../components/Avatar/Avatar';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignRawChannel } from '../../dApps/SignRawChannels/backgroundSignRawChannel';
import { SignRawOriginInput } from '../../dApps/SignRawChannels/types';

export function SignRawDApp(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const values = usePopupData<SignRawOriginInput>();

  const passwordField = usePasswordField();

  const identities = useIdentities().data;
  const identity = identities && identities[values.address as string];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!identity) {
        return;
      }

      const { address, data, id } = values;
      const { password } = await passwordField.get(event);

      const keypair = await decryptIdentity(address, password);
      const signature = u8aToHex(keypair.sign(data));
      await backgroundSignRawChannel.return({ id, signature });

      window.close();
    },
    [identity, passwordField, values],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignRawChannel.throw('Rejected');
    window.close();
  }, []);

  const messageRef = useRef<HTMLTextAreaElement>(null);
  const copy = useCopyButton(messageRef);

  if (!identity) {
    return null; // TODO: what to show when the user has no identities?
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignRawDApp_title')}</h1>

      <Avatar identity={identity} className={styles.avatar} />
      <h2 className={styles.identity}>{identity.name}</h2>

      <CopyValue
        value={identity.address}
        label={identity.name}
        className={styles.addressLine}
      />

      <dl className={styles.details}>
        <dt className={styles.detailName}>{t('view_SignRawDApp_from')}:</dt>
        <dd className={styles.detailValue} title={values.origin}>
          {values.origin}
        </dd>

        <dt className={styles.detailName} id="message">
          {t('view_SignRawDApp_message')}:
        </dt>
        <dd className={styles.detailValue}>
          <textarea
            className={styles.message}
            readOnly
            aria-labelledby="message"
            value={values.data}
            ref={messageRef}
          />
          {copy.supported && (
            <button
              className={copy.className}
              onClick={copy.handleCopyClick}
              type="button"
              aria-label={copy.title}
              title={copy.title}
            />
          )}
        </dd>
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignRawDApp_reject')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('view_SignRawDApp_CTA')}
        </button>
      </p>
    </form>
  );
}
