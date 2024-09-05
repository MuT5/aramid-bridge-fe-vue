import algosdk from 'algosdk';
import { IState } from '../../context/AppContext';
import { ethers } from 'ethers';

export const isValidAddress = (address: string, appData: IState): Boolean => {
  if (!appData.sourceChainConfiguration) return false;
  return (appData.sourceChainConfiguration.type === 'algo' && algosdk.isValidAddress(address)) || (appData.sourceChainConfiguration.type === 'eth' && ethers.isAddress(address));
};
