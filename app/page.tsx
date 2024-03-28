"use client";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import bs58 from "bs58";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useCallback } from "react";
import { Wallet } from "./Wallet";

export default function Home() {
  /* const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // 890880 lamports as of 2022-09-01
    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports,
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  }, [publicKey, sendTransaction, connection]); */

  /* connection
    .getAccountInfo(
      new PublicKey("BUwYuS6p6368KS39wJX1uG5Eh2BzzTA2m68gHhUihxQz")
    )
    .then((res) => {
      console.log(res?.lamports);
    }); */
  return (
    <div className="w-full h-screen bg-violet-200">
      <Wallet />
    </div>
  );
}
