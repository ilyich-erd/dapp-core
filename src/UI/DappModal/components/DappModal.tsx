import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { WithClassnameType } from '../../types';
import { DappModalConfig } from '../dappModal.types';
import styles from '../dappModalStyles.scss';
import { DappModalBody } from './DappModalBody';
import { DappModalFooter } from './DappModalFooter';
import { DappModalHeader } from './DappModalHeader';

type DappModalProps = {
  id?: string;
  visible: boolean;
  onHide?: () => void;
  parentElement?: Element;
  children?: React.ReactNode;
  config?: DappModalConfig;
} & WithClassnameType;

const defaultConfig: DappModalConfig = {
  showHeader: true,
  showFooter: false,
  headerText: '',
  footerText: ''
};

export const DappModal = ({
  id = 'dapp-modal',
  visible,
  onHide,
  parentElement,
  config = defaultConfig,
  children,
  className = 'dapp-modal-dialog-wrapper'
}: DappModalProps) => {
  if (!visible) {
    return null;
  }

  const {
    showHeader,
    showFooter,
    headerText,
    footerText,
    modalDialogClassName = 'dapp-modal-dialog',
    modalContentClassName = 'dapp-modal-dialog-content',
    modalHeaderClassName = 'dapp-modal-dialog-header',
    modalCloseButtonClassName = 'dapp-modal-dialog-close-button',
    modalBodyClassName = 'dapp-modal-dialog-content-body',
    modalFooterClassName = 'dapp-modal-dialog-footer',
    customModalHeader,
    customModalFooter
  } = config;

  return ReactDOM.createPortal(
    <div
      id={id}
      role='dialog'
      aria-modal='true'
      className={classNames(modalDialogClassName, styles.dappModal, className)}
    >
      <div
        className={classNames(styles.dappModalContent, modalContentClassName)}
      >
        <DappModalHeader
          visible={showHeader}
          headerText={headerText}
          customHeader={customModalHeader}
          className={modalHeaderClassName}
          closeButtonClassName={modalCloseButtonClassName}
          onHide={onHide}
        />

        <DappModalBody className={modalBodyClassName}>{children}</DappModalBody>

        <DappModalFooter
          visible={showFooter}
          customFooter={customModalFooter}
          footerText={footerText}
          className={modalFooterClassName}
        />
      </div>
    </div>,
    parentElement ?? document.body
  );
};
