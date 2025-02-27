import { useState } from 'react';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider';

import { SECOND_LOGIN_ATTEMPT_ERROR } from 'constants/errorsMessages';
import { setAccountProvider } from 'providers/accountProvider';
import { loginAction } from 'reduxStore/commonActions';
import { useDispatch } from 'reduxStore/DappProviderContext';
import { setTokenLogin } from 'reduxStore/slices';
import {
  InitiateLoginFunctionType,
  LoginHookGenericStateType,
  OnProviderLoginType
} from 'types';
import { LoginMethodsEnum } from 'types/enums.types';
import { getIsLoggedIn } from 'utils/getIsLoggedIn';
import { optionalRedirect } from 'utils/internal';

export type UseExtensionLoginReturnType = [
  InitiateLoginFunctionType,
  LoginHookGenericStateType
];

export const useExtensionLogin = ({
  callbackRoute,
  token,
  onLoginRedirect
}: OnProviderLoginType): UseExtensionLoginReturnType => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = getIsLoggedIn();

  async function initiateLogin() {
    if (isLoggedIn) {
      throw new Error(SECOND_LOGIN_ATTEMPT_ERROR);
    }

    setIsLoading(true);
    const provider: ExtensionProvider = ExtensionProvider.getInstance();

    try {
      const isSuccessfullyInitialized: boolean = await provider.init();

      if (!isSuccessfullyInitialized) {
        console.warn(
          'Something went wrong trying to redirect to wallet login..'
        );
        return;
      }

      const callbackUrl: string = encodeURIComponent(
        `${window.location.origin}${callbackRoute ?? window.location.pathname}`
      );
      const providerLoginData = {
        callbackUrl,
        ...(token && { token })
      };

      await provider.login(providerLoginData);

      setAccountProvider(provider);

      const { signature, address } = provider.account;

      if (!address) {
        setIsLoading(false);
        console.warn('Login cancelled.');
        return;
      }

      if (signature) {
        dispatch(
          setTokenLogin({
            loginToken: String(token),
            signature
          })
        );
      }

      dispatch(
        loginAction({ address, loginMethod: LoginMethodsEnum.extension })
      );

      optionalRedirect({
        callbackRoute,
        onLoginRedirect,
        options: { signature, address }
      });
    } catch (error) {
      console.error('error loging in', error);
      // TODO: can be any or typed error
      setError('error logging in' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  }

  const loginFailed = Boolean(error);

  return [
    initiateLogin,
    {
      loginFailed,
      error,
      isLoading: isLoading && !loginFailed,
      isLoggedIn: isLoggedIn && !loginFailed
    }
  ];
};
