import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GAS_ESTIMATE_TYPES } from '../../shared/constants/gas';
import {
  getEstimatedGasFeeTimeBounds,
  getGasEstimateType,
  getGasFeeEstimates,
} from '../ducks/metamask/metamask';
import {
  disconnectGasFeeEstimatePoller,
  getGasFeeEstimatesAndStartPolling,
} from '../store/actions';

export function useGasFeeEstimates() {
  const gasEstimateType = useSelector(getGasEstimateType);
  const gasFeeEstimates = useSelector(getGasFeeEstimates);
  const estimatedGasFeeTimeBounds = useSelector(getEstimatedGasFeeTimeBounds);
  useEffect(() => {
    let pollToken;
    getGasFeeEstimatesAndStartPolling().then((newPollToken) => {
      pollToken = newPollToken;
    });
    return () => {
      if (pollToken) {
        disconnectGasFeeEstimatePoller(pollToken);
      }
    };
  }, []);

  const isGasEstimatesLoading = gasEstimateType === GAS_ESTIMATE_TYPES.NONE;

  return {
    gasFeeEstimates,
    gasEstimateType,
    estimatedGasFeeTimeBounds,
    isGasEstimatesLoading,
  };
}
