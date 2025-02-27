import React from 'react';
import classNames from 'classnames';

import { DECIMALS } from 'constants/index';
import { ExplorerLink } from 'UI/ExplorerLink';
import { FormatAmount } from 'UI/FormatAmount';
import { TransactionActionTokenReturnType } from 'utils/transactions/transactionInfoHelpers/getTransactionActionTokenText';

import globalStyles from 'assets/sass/main.scss';

export const TransactionActionToken = ({
  tokenExplorerLink,
  showFormattedAmount,
  tokenLinkText,
  token,
  showLastNonZeroDecimal
}: TransactionActionTokenReturnType) => {
  if (!token.token) {
    return null;
  }

  return (
    <>
      {showFormattedAmount && (
        <div className={globalStyles.textTruncate}>
          <FormatAmount
            value={token.value}
            digits={2}
            showLabel={false}
            decimals={token.decimals ?? DECIMALS}
            showLastNonZeroDecimal={showLastNonZeroDecimal}
            data-testid='tokenFormattedAmount'
          />
        </div>
      )}

      <ExplorerLink
        page={tokenExplorerLink}
        data-testid='tokenExplorerLink'
        className={classNames(globalStyles.dFlex, {
          [globalStyles.sideLink]: token.svgUrl
        })}
      >
        <div
          className={classNames(
            globalStyles.dFlex,
            globalStyles.alignItemsCenter
          )}
        >
          {token.svgUrl && (
            <img
              src={token.svgUrl}
              alt={token.name}
              className={classNames(globalStyles.sideIcon, globalStyles.mr1)}
            />
          )}
          <span>{tokenLinkText}</span>
        </div>
      </ExplorerLink>
    </>
  );
};
