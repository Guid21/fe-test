import React from 'react';

interface NetworkLogoProps {
  chainName: string;
}

const chainLogoMap: Record<string, string> = {
  ETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  BSC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  BASE: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
  SOL: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
};

export const NetworkLogo: React.FC<NetworkLogoProps> = ({ chainName }) => {
  const logoUrl =
    chainLogoMap[chainName] ||
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';

  return <img src={logoUrl} alt={chainName} className="w-4 h-4 rounded-full" />;
};
