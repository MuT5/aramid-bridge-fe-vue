import { AbiCoder, ethers } from 'ethers';

export const decodeLockToken = (data: string) => {
  const lockTokensInputs = AbiCoder.defaultAbiCoder().decode(['address', 'uint256', 'address', 'uint256', 'uint32', 'string', 'uint256', 'string'], ethers.dataSlice(data, 4));
  console.log('decoded lock tokens inputs:', lockTokensInputs);
};

export const decodeLockNativeCurrency = (data: string) => {
  const lockNativeCurrencyInputs = AbiCoder.defaultAbiCoder().decode(['address', 'uint256', 'uint256', 'uint32', 'string', 'uint256', 'string'], ethers.dataSlice(data, 4));
  console.log('decoded lock native token inputs:', lockNativeCurrencyInputs);
};
