import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useGetSignedTransactions, useGetPendingTransactions } from 'hooks';
import {
  getToastsIdsFromStorage,
  setToastsIdsToStorage
} from 'storage/session';
import { SignedTransactionsBodyType, SignedTransactionsType } from 'types';
import { TransactionToast } from 'UI/TransactionToast';
import { getGeneratedClasses } from 'UI/utils';

import styles from './styles.scss';

export interface TransactionsToastListPropsType {
  toastProps?: any;
  className?: string;
  withTxNonce?: boolean;
  shouldRenderDefaultCss?: boolean;
  pendingTransactions?: SignedTransactionsType;
  signedTransactions?: SignedTransactionsType;
  successfulToastLifetime?: number;
  parentElement?: Element | DocumentFragment;
}

export const TransactionsToastList = ({
  shouldRenderDefaultCss = true,
  withTxNonce = false,
  className = '',
  pendingTransactions,
  signedTransactions,
  successfulToastLifetime,
  parentElement
}: TransactionsToastListPropsType) => {
  const [toastsIds, setToastsIds] = useState<any>([]);

  const pendingTransactionsFromStore =
    useGetPendingTransactions().pendingTransactions;

  const signedTransactionsFromStore =
    useGetSignedTransactions().signedTransactions;

  const pendingTransactionsToRender =
    pendingTransactions || pendingTransactionsFromStore;

  const signedTransactionsToRender =
    signedTransactions || signedTransactionsFromStore;

  const mappedToastsList = toastsIds?.map((toastId: string) => {
    const currentTx: SignedTransactionsBodyType =
      signedTransactionsToRender[toastId];
    if (
      currentTx == null ||
      currentTx?.transactions == null ||
      currentTx?.status == null
    ) {
      return null;
    }

    const { transactions, status } = currentTx;

    return (
      <TransactionToast
        className={className}
        key={toastId}
        transactions={transactions}
        status={status}
        toastId={toastId}
        withTxNonce={withTxNonce}
        lifetimeAfterSuccess={successfulToastLifetime}
      />
    );
  });

  const mapPendingSignedTransactions = () => {
    const newToasts = [...toastsIds];

    for (const sessionId in pendingTransactionsToRender) {
      const hasToast = toastsIds.includes(sessionId);

      if (!hasToast) {
        newToasts.push(sessionId);
      }
    }

    setToastsIds(newToasts);
  };

  const fetchSessionStorageToasts = () => {
    const sessionStorageToastsIds = getToastsIdsFromStorage();

    if (sessionStorageToastsIds) {
      const newToasts = [...toastsIds, ...sessionStorageToastsIds];
      setToastsIds(newToasts);
    }
  };

  const saveSessionStorageToasts = () => {
    const shouldSaveLocalToasts = Boolean(toastsIds.length);
    if (!shouldSaveLocalToasts) {
      return;
    }

    setToastsIdsToStorage(toastsIds);
  };

  useEffect(() => {
    fetchSessionStorageToasts();
    return () => {
      saveSessionStorageToasts();
    };
  }, []);

  useEffect(() => {
    mapPendingSignedTransactions();
  }, [pendingTransactionsToRender]);

  const style = getGeneratedClasses(className, shouldRenderDefaultCss, {
    ...styles
  });

  return createPortal(
    <div className={style.toasts}>{mappedToastsList}</div>,
    parentElement || document.body
  );
};
