import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { WithClassnameType } from '../types';

import globalStyles from 'assets/sass/main.scss';

// TODO: Rename to "IconStatePropsType" when dapp-core@3.0.0
export interface IconStateProps extends WithClassnameType {
  icon: IconProp;
  iconSize?: '2x' | '3x' | '5x';
}

export const IconState = ({
  icon,
  iconSize = '3x',
  className = 'dapp-icon-state'
}: IconStateProps) => {
  const classes = {
    wrapper: classNames(
      globalStyles.iconState,
      globalStyles.mxAuto,
      {
        half: iconSize === '2x'
      },
      className
    ),
    icon: globalStyles.textWhite
  };

  return (
    <span className={classes.wrapper}>
      <FontAwesomeIcon icon={icon} size={iconSize} className={classes.icon} />
    </span>
  );
};
