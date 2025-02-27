import React from 'react';

import { CopyButton } from 'UI/CopyButton';
import { ExplorerLink } from 'UI/ExplorerLink';
import {
  ScAddressIcon,
  AccountName,
  ShardSpan
} from 'UI/TransactionsTable/components';
import { addressIsValid } from 'utils/account/addressIsValid';

import { WithTransactionType } from '../../../../../UI/types';
import { DetailItem } from '../../DetailItem';

import styles from './styles.scss';

export const TransactionInfoFrom = ({ transaction }: WithTransactionType) => (
  <DetailItem title='From' className={styles.from}>
    <div className={styles.wrapper}>
      <ScAddressIcon initiator={transaction.sender} />

      {addressIsValid(transaction.sender) ? (
        <>
          <ExplorerLink
            page={String(transaction.links.senderLink)}
            className={styles.explorer}
          >
            <AccountName
              address={transaction.sender}
              assets={transaction.senderAssets}
            />
          </ExplorerLink>

          <CopyButton className={styles.copy} text={transaction.sender} />

          <ExplorerLink
            page={String(transaction.links.senderShardLink)}
            className={styles.shard}
          >
            (<ShardSpan shard={transaction.senderShard} />)
          </ExplorerLink>
        </>
      ) : (
        <span className={styles.shard}>
          (<ShardSpan shard={transaction.sender} />)
        </span>
      )}
    </div>
  </DetailItem>
);
