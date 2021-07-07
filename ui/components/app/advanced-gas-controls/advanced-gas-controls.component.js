import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { I18nContext } from '../../../contexts/i18n';
import Typography from '../../ui/typography/typography';
import {
  FONT_WEIGHT,
  TYPOGRAPHY,
  COLORS,
} from '../../../helpers/constants/design-system';
import FormField from '../../ui/form-field';

const DEFAULT_ESTIMATES_LEVEL = 'medium';

export default function AdvancedGasControls({
  estimateToUse,
  gasFeeEstimates,
  maxPriorityFee,
  maxFee,
  setMaxPriorityFee,
  setMaxFee,
  onManualChange,
  gasLimit,
  setGasLimit,
  gasPrice,
  setGasPrice,
  maxPriorityFeeFiat,
  maxFeeFiat,
  maxPriorityFeeError,
  maxFeeError,
}) {
  const t = useContext(I18nContext);

  const suggestedMaxPriorityFeePerGas =
    gasFeeEstimates?.[estimateToUse]?.suggestedMaxPriorityFeePerGas;
  const suggestedMaxFeePerGas =
    gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas;

  return (
    <div className="advanced-gas-controls">
      <FormField
        titleText={t('gasLimit')}
        onChange={setGasLimit}
        tooltipText=""
        value={gasLimit}
        numeric
        autoFocus
      />
      {process.env.SHOW_EIP_1559_UI ? (
        <>
          <FormField
            titleText={t('maxPriorityFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={(value) => {
              setMaxPriorityFee(value);
              onManualChange?.();
            }}
            value={maxPriorityFee}
            detailText={maxPriorityFeeFiat}
            titleDetailText={
              suggestedMaxPriorityFeePerGas && (
                <>
                  <Typography
                    tag="span"
                    color={COLORS.UI4}
                    variant={TYPOGRAPHY.H8}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {t('gasFeeEstimate')}:
                  </Typography>{' '}
                  <Typography
                    tag="span"
                    color={COLORS.UI4}
                    variant={TYPOGRAPHY.H8}
                  >
                    {
                      gasFeeEstimates?.[DEFAULT_ESTIMATES_LEVEL]
                        ?.suggestedMaxPriorityFeePerGas
                    }
                  </Typography>
                </>
              )
            }
            error={maxPriorityFeeError}
          />
          <FormField
            titleText={t('maxFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={(value) => {
              setMaxFee(value);
              onManualChange?.();
            }}
            value={maxFee}
            numeric
            detailText={maxFeeFiat}
            titleDetail={
              suggestedMaxFeePerGas && (
                <>
                  <Typography
                    tag="span"
                    color={COLORS.UI4}
                    variant={TYPOGRAPHY.H8}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {t('gasFeeEstimate')}:
                  </Typography>{' '}
                  <Typography
                    tag="span"
                    color={COLORS.UI4}
                    variant={TYPOGRAPHY.H8}
                  >
                    {
                      gasFeeEstimates?.[DEFAULT_ESTIMATES_LEVEL]
                        ?.suggestedMaxFeePerGas
                    }
                  </Typography>
                </>
              )
            }
            error={maxFeeError}
          />
        </>
      ) : (
        <>
          <FormField
            titleText={t('gasPrice')}
            titleUnit="(GWEI)"
            onChange={setGasPrice}
            tooltipText={t('editGasPriceTooltip')}
            value={gasPrice}
            numeric
          />
        </>
      )}
    </div>
  );
}

AdvancedGasControls.propTypes = {
  estimateToUse: PropTypes.oneOf(['high', 'medium', 'low']),
  gasFeeEstimates: PropTypes.oneOf([
    PropTypes.shape({
      gasPrice: PropTypes.string,
    }),
    PropTypes.shape({
      low: PropTypes.object,
      medium: PropTypes.object,
      high: PropTypes.object,
      estimatedBaseFee: PropTypes.string,
    }),
  ]),
  setMaxPriorityFee: PropTypes.func,
  setMaxFee: PropTypes.func,
  maxPriorityFee: PropTypes.number,
  maxFee: PropTypes.number,
  onManualChange: PropTypes.func,
  gasLimit: PropTypes.number,
  setGasLimit: PropTypes.func,
  gasPrice: PropTypes.number,
  setGasPrice: PropTypes.func,
  maxPriorityFeeFiat: PropTypes.string,
  maxFeeFiat: PropTypes.string,
  maxPriorityFeeError: PropTypes.string,
  maxFeeError: PropTypes.string,
};
