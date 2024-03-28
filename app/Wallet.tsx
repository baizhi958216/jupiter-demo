import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SendLamport } from "./SendLamport";
import "@solana/wallet-adapter-react-ui/styles.css";

export const Wallet: FC = () => {
  //   'devnet', 'testnet', 'mainnet-beta'.
  //   const network = WalletAdapterNetwork.Devnet;

  //   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  //   自定义节点
  const endpoint = useMemo(() => "http://localhost:8899", []);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex gap-3 p-6">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <SendLamport />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
