import { useEffect, useMemo } from 'react';
import { useGetTransactionDisplayInfo } from 'hooks';
import { useSelector } from 'reduxStore/DappProviderContext';
import { shardSelector } from 'reduxStore/selectors';
import { TransactionBatchStatusesEnum } from 'types';

import { getAreTransactionsOnSameShard } from 'utils/transactions/getAreTransactionsOnSameShard';
import {
  getIsTransactionPending,
  getIsTransactionTimedOut
} from 'utils/transactions/transactionStateByStatus';

import { getUnixTimestamp } from 'utils/dateTime/getUnixTimestamp';
import { getUnixTimestampWithAddedMilliseconds } from 'utils/dateTime/getUnixTimestampWithAddedMilliseconds';

import styles from '../styles.scss';
import { TransactionToastDefaultProps } from '../transactionToast.type';
import { getToastDataStateByStatus } from '../utils';

const AVERAGE_TX_DURATION_MS = 6000;
const CROSS_SHARD_ROUNDS = 5;

export const useTransactionToast = ({
  toastId,
  transactions,
  status,
  lifetimeAfterSuccess,
  startTimestamp,
  endTimeProgress,
  onDelete
}: TransactionToastDefaultProps) => {
  const transactionDisplayInfo = useGetTransactionDisplayInfo(toastId);
  const accountShard = useSelector(shardSelector);

  const areSameShardTransactions = useMemo(
    () => getAreTransactionsOnSameShard(transactions, accountShard),
    [transactions, accountShard]
  );

  const shardAdjustedDuration = areSameShardTransactions
    ? AVERAGE_TX_DURATION_MS
    : CROSS_SHARD_ROUNDS * AVERAGE_TX_DURATION_MS;

  const transactionDuration =
    transactionDisplayInfo?.transactionDuration || shardAdjustedDuration;

  const [startTime, endTime] = useMemo(() => {
    const startTime = startTimestamp || getUnixTimestamp();
    const endTime =
      endTimeProgress ||
      getUnixTimestampWithAddedMilliseconds(transactionDuration);

    return [startTime, endTime];
  }, []);

  const progress = { startTime, endTime };

  const isPending = getIsTransactionPending(status);
  const isTimedOut = getIsTransactionTimedOut(status);

  const toastDataState = getToastDataStateByStatus({
    status,
    toastId,
    transactionDisplayInfo,
    classes: styles
  });

  const handleDeleteToast = () => {
    onDelete?.(toastId);
  };

  useEffect(() => {
    if (
      status !== TransactionBatchStatusesEnum.success ||
      !lifetimeAfterSuccess
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      handleDeleteToast();
    }, lifetimeAfterSuccess);

    return () => {
      clearTimeout(timeout);
    };
  }, [lifetimeAfterSuccess, status]);

  return {
    progress,
    isPending,
    isTimedOut,
    toastDataState,
    handleDeleteToast
  };
};
