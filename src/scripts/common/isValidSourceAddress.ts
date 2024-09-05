import algosdk from 'algosdk';
import { ethers } from 'ethers';
import { IState } from '../../context/AppContext';
import ChainItem from '../interface/mapping/ChainItem';

const isValidSourceAddress = (appData: IState): boolean => {
  if (!appData.sourceChainConfiguration) return false;
  // checks if source address is valid
  return isValidAddress(appData.sourceChainConfiguration, appData.sourceAddress);
};

export const isValidDestinationAddress = (appData: IState): boolean => {
  if (!appData.destinationChainConfiguration) return false;
  // checks if source address is valid
  return isValidAddress(appData.destinationChainConfiguration, appData.destinationAddress);
};

export const isValidAddress = (chainConf: ChainItem, address: string) => {
  return (
    (chainConf && chainConf.type == 'algo' && algosdk.isValidAddress(address)) ||
    (chainConf && chainConf.type == 'eth' && ethers.isAddress(address)) ||
    (chainConf && chainConf.type == 'near' && isValidNearAddress(address))

    // near address format has to be check while fixing bugs
  );
};

export function isValidNearAddress(address: string) {
  if (typeof address !== 'string') return false;

  // if (address.length < 2 || address.length > 32) return false;
  const pattern = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;
  return pattern.test(address);
}
export default isValidSourceAddress;
