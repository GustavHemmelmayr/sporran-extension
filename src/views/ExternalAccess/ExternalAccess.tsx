import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './ExternalAccess.module.css';

import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { paths } from '../paths';

export function ExternalAccess(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [hosts, setHosts] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    (async () => {
      setHosts(await getAuthorized());
    })();
  }, [setHosts]);

  const handleChange = useCallback(
    (event) => {
      if (!hosts) {
        return;
      }

      const { name, checked } = event.target;

      setHosts({
        ...hosts,
        [name]: checked,
      });

      (async () => {
        const authorized = await getAuthorized();
        authorized[name] = checked;
        await setAuthorized(authorized);
      })();
    },
    [hosts],
  );

  if (!hosts) {
    return null; // storage data pending
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ExternalAccess_heading')}</h1>
      <p className={styles.subline}>{t('view_ExternalAccess_subline')}</p>

      <small className={styles.small}>{t('view_ExternalAccess_small')}</small>

      <ul className={styles.list}>
        {Object.entries(hosts).map(([host, checked]) => (
          <li key={host}>
            <label className={styles.label}>
              {host}
              <span className={styles.denied} aria-hidden>
                {t('view_ExternalAccess_denied')}
              </span>
              <input
                name={host}
                className={styles.toggle}
                type="checkbox"
                defaultChecked={checked}
                onClick={handleChange}
              />
              <span />
              <span className={styles.allowed} aria-hidden>
                {t('view_ExternalAccess_allowed')}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <Link className={styles.back} to={paths.home}>
        {t('view_ExternalAccess_back')}
      </Link>

      <LinkBack />
      <Stats />
    </section>
  );
}
