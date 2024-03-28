"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

const SOL = "So11111111111111111111111111111111111111112";
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const SendLamport: React.FC = () => {
  const { publicKey } = useWallet();
  const [queryResponse, setQueryResponse] = useState();
  const [inputMint, setInputMint] = useState(SOL);
  const [outputMint, setOutputMint] = useState(USDC);
  const [amount, setAmount] = useState(1);
  const [slippageBps, setSlippageBps] = useState(50);
  // https://quote-api.jup.ag/v6/quote?inputMint= &outputMint= &amount= &slippageBps=
  useEffect(() => {
    fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${
        amount * 1000000000
      }&slippageBps=${slippageBps}`
    )
      .then((res) => res.json())
      .then((data) => {
        setQueryResponse(data);
      });
  }, [amount, slippageBps, inputMint, outputMint]);

  const buyThispls = async () => {
    const tokenAccount = getAssociatedTokenAddressSync(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID
    );

    // 获取swap的transactions
    const transactions = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // /quote接口的响应
          quoteResponse: queryResponse,
          destinationTokenAccount: tokenAccount.toString(),
          userPublicKey: publicKey?.toString(),
        }),
      })
    ).json();

    const { swapTransaction } = transactions;
    console.log(swapTransaction);
  };
  return (
    <div>
      <div className="px-6 flex flex-col gap-2">
        <div>
          inputMint:
          <input
            className="px-3 py-2"
            defaultValue={inputMint}
            onChange={(e) => setInputMint(e.target.value)}
          />
        </div>
        <div>
          outputMint:
          <input
            className="px-3 py-2"
            defaultValue={outputMint}
            onChange={(e) => setOutputMint(e.target.value)}
          />
        </div>
        <div>
          amount:
          <input
            className="px-3 py-2"
            defaultValue={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          slippageBps:
          <input
            className="px-3 py-2"
            defaultValue={slippageBps}
            onChange={(e) => setSlippageBps(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="px-6 flex flex-col gap-2">
        <button onClick={() => buyThispls()}>买买买</button>
      </div>
    </div>
  );
};
