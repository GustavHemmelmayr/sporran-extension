import { useCallback, useState } from 'react';
import {
  Route,
  Routes,

  useNavigate,
} from 'react-router-dom';
import { IDidServiceEndpoint } from '@kiltprotocol/types';

import { Identity } from '../../utilities/identities/types';
import { DidEndpointsForm } from '../DidEndpointsForm/DidEndpointsForm';
import { DidEndpointsSign } from '../DidEndpointsSign/DidEndpointsSign';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidEndpointsFlow({ identity }: Props): JSX.Element {
  const navigate = useNavigate();

  const [type, setType] = useState<'add' | 'remove'>('add');
  const [values, setValues] = useState<IDidServiceEndpoint | undefined>();

  const { address } = identity;
  const signPath = generatePath(paths.identity.did.endpoints.sign, { address });

  const onAdd = useCallback(
    async (endpoint) => {
      setType('add');
      setValues(endpoint);
      navigate(signPath);
    },
    [navigate, signPath],
  );

  const onRemove = useCallback(
    async (endpoint) => {
      setType('remove');
      setValues(endpoint);
      navigate(signPath);
    },
    [navigate, signPath],
  );

  return (
    <Routes>
      <Route
        path={paths.identity.did.endpoints.sign}
        element={
          values && (
            <DidEndpointsSign
              identity={identity}
              type={type}
              endpoint={values}
            />
          )
        }
      />
      <Route
        path={paths.identity.did.endpoints.start}
        element={
          <DidEndpointsForm
            identity={identity}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        }
      />
    </Routes>
  );
}
