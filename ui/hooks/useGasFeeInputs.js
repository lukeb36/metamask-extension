import { addHexPrefix } from 'ethereumjs-util';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { GAS_ESTIMATE_TYPES } from '../../shared/constants/gas';
import { multiplyCurrencies } from '../../shared/modules/conversion.utils';
import {
  getMaximumGasTotalInHexWei,
  getMinimumGasTotalInHexWei,
} from '../../shared/modules/gas.utils';
import { PRIMARY, SECONDARY } from '../helpers/constants/common';
import {
  decGWEIToHexWEI,
  decimalToHex,
} from '../helpers/utils/conversions.util';
import { getShouldShowFiat } from '../selectors';
import { useCurrencyDisplay } from './useCurrencyDisplay';
import { useGasFeeEstimates } from './useGasFeeEstimates';
import { useUserPreferencedCurrency } from './useUserPreferencedCurrency';

function getProperGasPrice(gasFeeEstimates, gasEstimateType, estimateToUse) {
  if (gasEstimateType === GAS_ESTIMATE_TYPES.LEGACY) {
    return gasFeeEstimates?.[estimateToUse] ?? null;
  } else if (gasEstimateType === GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
    return gasFeeEstimates?.gasPrice ?? null;
  }
  return null;
}

export function useGasFeeInputs(defaultEstimateToUse = 'medium') {
  const showFiat = useSelector(getShouldShowFiat);

  const [estimateToUse, setEstimateToUse] = useState(defaultEstimateToUse);
  const {
    gasEstimateType,
    gasFeeEstimates,
    isGasEstimatesLoading,
  } = useGasFeeEstimates();

  const [maxFeePerGas, setMaxFeePerGas] = useState(() =>
    gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET
      ? gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas ?? null
      : null,
  );
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(() =>
    gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET
      ? gasFeeEstimates?.[estimateToUse]?.suggestedMaxPriorityFeePerGas ?? null
      : null,
  );

  const [gasPrice, setGasPrice] = useState(() =>
    getProperGasPrice(gasFeeEstimates, gasEstimateType, estimateToUse),
  );

  const [gasLimit, setGasLimit] = useState(() => 21000);

  useEffect(() => {
    if (isGasEstimatesLoading === false && estimateToUse) {
      if (gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
        setMaxPriorityFeePerGas(
          gasFeeEstimates?.[estimateToUse]?.suggestedMaxPriorityFeePerGas,
        );
        setMaxFeePerGas(
          gasFeeEstimates?.[estimateToUse]?.suggestedMaxFeePerGas,
        );
      } else {
        setGasPrice(
          getProperGasPrice(gasFeeEstimates, gasEstimateType, estimateToUse),
        );
      }
    }
  }, [isGasEstimatesLoading, gasEstimateType, estimateToUse, gasFeeEstimates]);

  const gasCalculationObject = useMemo(() => {
    const gasSettings = {
      gasLimit: decimalToHex(gasLimit),
    };
    if (gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
      gasSettings.maxFeePerGas = decGWEIToHexWEI(maxFeePerGas ?? '0');
      gasSettings.maxPriorityFeePerGas = decGWEIToHexWEI(
        maxPriorityFeePerGas ?? '0',
      );
      gasSettings.baseFeePerGas = decGWEIToHexWEI(
        gasFeeEstimates.estimatedBaseFee ?? '0',
      );
    } else if (gasEstimateType === GAS_ESTIMATE_TYPES.NONE) {
      gasSettings.gasPrice = '0x0';
    } else {
      gasSettings.gasPrice = decGWEIToHexWEI(gasPrice ?? '0');
    }
    return gasSettings;
  }, [
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasPrice,
    gasLimit,
    gasEstimateType,
    gasFeeEstimates,
  ]);

  const maximumCostInHexWei = getMaximumGasTotalInHexWei(gasCalculationObject);
  const minimumCostInHexWei = getMinimumGasTotalInHexWei(gasCalculationObject);

  const { currency, numberOfDecimals } = useUserPreferencedCurrency(SECONDARY);
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY);

  const [, maxPriorityFeePerGasParts] = useCurrencyDisplay(
    addHexPrefix(
      multiplyCurrencies(maxPriorityFeePerGas ?? '0', gasLimit, {
        toNumericBase: 'hex',
        fromDenomination: 'GWEI',
        toDenomination: 'WEI',
        multiplicandBase: 10,
        multiplierBase: 10,
      }),
    ),
    {
      numberOfDecimals,
      currency,
    },
  );
  console.log(maxPriorityFeePerGasParts);
  const maxPriorityFeePerGasFiat = showFiat
    ? maxPriorityFeePerGasParts.value
    : '';

  const [, maxFeePerGasParts] = useCurrencyDisplay(maximumCostInHexWei, {
    numberOfDecimals,
    currency,
  });
  const maxFeePerGasFiat = showFiat ? maxFeePerGasParts.value : '';

  const [maxFeePerGasPrimary] = useCurrencyDisplay(maximumCostInHexWei, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency,
  });

  // The big number should be `(estimatedBaseFee + (customMaxPriorityFeePerGas || selectedFeeEstimate.suggestedMaxPriorityFeePerGas)) * gasLimit` and then converted to fiat
  const [, bannerTotalParts] = useCurrencyDisplay(minimumCostInHexWei, {
    numberOfDecimals,
    currency,
  });
  const bannerTotal = bannerTotalParts.value;

  return {
    maxFeePerGas,
    setMaxFeePerGas,
    maxPriorityFeePerGasParts,
    setMaxPriorityFeePerGas,
    gasPrice,
    setGasPrice,
    gasLimit,
    setGasLimit,
    bannerTotal,
    maxFeePerGasFiat,
    maxFeePerGasPrimary,
    maxPriorityFeePerGas,
    maxPriorityFeePerGasFiat,
    estimateToUse,
    setEstimateToUse,
    isGasEstimatesLoading,
    gasEstimateType,
    gasFeeEstimates,
  };
}
