import { MemoryRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import * as styles from './App.module.css';

import { RouteExcept } from '../../components/RouteExcept/RouteExcept';
import { useInitialEntries } from '../../utilities/popups/useInitialEntries';
import { ConfigurationProvider } from '../../configuration/ConfigurationContext';
import { IdentitiesProvider } from '../../utilities/identities/IdentitiesContext';
import { CredentialsProvider } from '../../utilities/credentials/CredentialsContext';
import { GenericError } from '../GenericError/GenericError';
import { AddIdentity } from '../../components/AddIdentity/AddIdentity';
import { Settings } from '../../components/Settings/Settings';
import { ExternalAccess } from '../ExternalAccess/ExternalAccess';
import { Welcome } from '../Welcome/Welcome';
import { IdentitiesRouter } from '../IdentitiesRouter/IdentitiesRouter';
import { PopupsRouter } from '../PopupsRouter/PopupsRouter';
import { AppSettings } from '../AppSettings/AppSettings';

import { paths } from '../paths';

export function App(): JSX.Element {
  const initialEntries = useInitialEntries();

  const pathsWithoutTopButtons = [
    paths.popup.base,
    paths.popup.signDid,
    paths.popup.claim,
  ];

  return (
    <div className={styles.container}>
      <GenericError>
        <MemoryRouter initialEntries={initialEntries}>
          <RouteExcept path={pathsWithoutTopButtons}>
            <nav className={styles.menus}>
              <AddIdentity />
              <Settings />
            </nav>
          </RouteExcept>

          <Switch>
            <Route path={paths.home} exact>
              <Welcome />
            </Route>

            <Route path={paths.settings}>
              <AppSettings />
            </Route>

            <Route path={paths.access}>
              <ExternalAccess />
            </Route>

            <Route path={paths.identity.base}>
              <IdentitiesRouter />
            </Route>

            <Route path={paths.popup.base}>
              <PopupsRouter />
            </Route>
          </Switch>
        </MemoryRouter>
      </GenericError>
    </div>
  );
}

export function AppWithProviders(): JSX.Element {
  return (
    <ConfigurationProvider>
      <IdentitiesProvider>
        <CredentialsProvider>
          <App />
        </CredentialsProvider>
      </IdentitiesProvider>
    </ConfigurationProvider>
  );
}
