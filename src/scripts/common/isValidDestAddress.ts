import { IState } from '../../context/AppContext';
import { isValidAddress } from './isValidSourceAddress';

const isValidDestAddress = (appData: IState, toValidate?: string): boolean => {
  const toCheck = toValidate ? toValidate : appData.destinationAddress;
  // address is address to be checked for the destination address purpose
  console.debug('isValidDestAddress.1', appData.destinationChainConfiguration, toCheck);
  if (!appData.destinationChainConfiguration) return false;
  if (!toCheck) return false;

  return isValidAddress(appData.destinationChainConfiguration, toCheck);
};

export default isValidDestAddress;
