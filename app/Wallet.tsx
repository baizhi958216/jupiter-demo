import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SendLamport } from "./SendLamport";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { Separator } from "@/components/ui/separator";

export const Wallet: FC = () => {
  //   'devnet', 'testnet', 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  //   自定义节点
  // const endpoint = useMemo(() => "http://localhost:8899", []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* <WalletMultiButton /> */}
          <div className="flex justify-between py-3 mx-5">
            <div>
              <WalletMultiButton className="opacity-90" />
            </div>
            <div>
              <WalletDisconnectButton />
            </div>
          </div>
          <Separator className="my-3" />
          <SendLamport />
          <Separator className="my-3" />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
