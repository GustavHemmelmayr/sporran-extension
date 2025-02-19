import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './IdentitySlide.module.css';

import { Avatar } from '../Avatar/Avatar';
import { IdentityOptions } from '../IdentityOptions/IdentityOptions';

import { Identity, saveIdentity } from '../../utilities/identities/identities';

interface Props {
  identity: Identity;
  options?: boolean;
}

export function IdentitySlide({
  identity,
  options = false,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [editing, setEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditing(false);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const name = event.target.elements.name.value;
      await saveIdentity({
        ...identity,
        name,
      });

      setEditing(false);
    },
    [identity],
  );

  return (
    <section>
      <Avatar identity={identity} />
      {!editing ? (
        <div className={options ? styles.nameLine : styles.centeredNameLine}>
          <span className={styles.name}>{identity.name}</span>
          {options && (
            <IdentityOptions identity={identity} onEdit={handleEditClick} />
          )}
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="name"
            required
            aria-label={t('component_IdentitySlide_name')}
            placeholder={t('component_IdentitySlide_name')}
            defaultValue={identity.name}
            autoComplete="off"
            autoFocus
          />
          <button
            className={styles.save}
            type="submit"
            aria-label={t('common_action_save')}
            title={t('common_action_save')}
          />
          <button
            className={styles.cancel}
            type="button"
            onClick={handleCancelClick}
            aria-label={t('common_action_cancel')}
            title={t('common_action_cancel')}
          />
        </form>
      )}
    </section>
  );
}
