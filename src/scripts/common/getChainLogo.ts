import ethLogo from '@assets/logos/chains/ethereum.png';
import algoLogo from '@assets/logos/chains/algorand.png';
import voiLogo from '@assets/logos/tokens/voi.png';
import auroraLogo from '@assets/logos/chains/aurora.svg';
import nearLogo from '@assets/logos/chains/near.png';
import maticLogo from '@assets/logos/chains/polygon-matic-logo.png';
import circle from '@assets/circle.png';

const getChainLogo = (chainLogo: string) => {
  // returns network logo
  switch (chainLogo) {
    case 'eth':
      return ethLogo;
    case 'polygon':
      return maticLogo;
    case 'algo':
      return algoLogo;
    case 'voi':
      return voiLogo;
    case 'aurora':
      return auroraLogo;
    case 'Near':
      return nearLogo;
    default:
      return circle;
  }
};

export default getChainLogo;
