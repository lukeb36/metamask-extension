import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { I18nContext } from '../../../contexts/i18n';
import Typography from '../../ui/typography/typography';
import {
  FONT_WEIGHT,
  TYPOGRAPHY,
  COLORS,
} from '../../../helpers/constants/design-system';
import FormField from '../../ui/form-field';

export default function AdvancedGasControls({
  isGasEstimatesLoading,
  estimateToUse = 'high',
  gasFeeEstimates,
}) {
  const t = useContext(I18nContext);

  const [gasLimit, setGasLimit] = useState(undefined);
  const [maxPriorityFee, setMaxPriorityFee] = useState(undefined);
  const [maxFee, setMaxFee] = useState(undefined);
  const prevIsGasEstimatesLoading = useRef(true);
  const prevEstimateToUse = useRef(estimateToUse);

  const { suggestedMaxFeePerGas, suggestedMaxPriorityFeePerGas } =
    gasFeeEstimates?.[estimateToUse] ?? {};

  // useEffect(() => {
  //   if (
  //     prevIsGasEstimatesLoading.current === true &&
  //     isGasEstimatesLoading === false
  //   ) {
  //     setMaxPriorityFee(suggestedMaxPriorityFeePerGas);
  //     setMaxFee(suggestedMaxFeePerGas);
  //   }
  //   prevIsGasEstimatesLoading.current = isGasEstimatesLoading;
  // }, [
  //   isGasEstimatesLoading,
  //   estimateToUse,
  //   suggestedMaxPriorityFeePerGas,
  //   suggestedMaxFeePerGas,
  // ]);

  // useEffect(() => {
  //   if (prevEstimateToUse.current !== estimateToUse) {
  //     setMaxFee(gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas);
  //     setMaxFee(gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas);
  //   }
  // }, [estimateToUse, gasFeeEstimates]);

  // Used in legacy version
  const [gasPrice, setGasPrice] = useState(0);

  return (
    <div className="advanced-gas-controls">
      <FormField
        titleText={t('gasLimit')}
        onChange={setGasLimit}
        tooltipText=""
        value={gasLimit}
        numeric
      />
      {process.env.SHOW_EIP_1559_UI ? (
        <>
          <FormField
            titleText={t('maxPriorityFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={setMaxPriorityFee}
            value={maxPriorityFee ?? suggestedMaxPriorityFeePerGas}
            numeric
            titleDetail={
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
                    gasFeeEstimates?.[estimateToUse]
                      ?.suggestedMaxPriorityFeePerGas
                  }
                </Typography>
              </>
            }
          />
          <FormField
            titleText={t('maxFee')}
            titleUnit="(GWEI)"
            tooltipText=""
            onChange={setMaxFee}
            value={maxFee ?? suggestedMaxFeePerGas}
            numeric
            titleDetail={
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
                  {gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas}
                </Typography>
              </>
            }
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
  isGasEstimatesLoading: PropTypes.boolean,
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
};
