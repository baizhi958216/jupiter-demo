"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { VersionedTransaction } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Quote } from "./types/Quote";
import { Skeleton } from "@/components/ui/skeleton";

const SOL = "So11111111111111111111111111111111111111112";
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const SendLamport: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signMessage } = useWallet();
  const [queryResponse, setQueryResponse] = useState<Quote>();
  const [inputMint, setInputMint] = useState(SOL);
  const [outputMint, setOutputMint] = useState(USDC);
  const [amount, setAmount] = useState(1);
  const [slippageBps, setSlippageBps] = useState(50);
  const [topTokens, setTopTokens] = useState([]);
  const [loadResp, setLoadResp] = useState(true);
  const getTokens = () =>
    fetch("https://cache.jup.ag/top-tokens")
      .then((res) => res.json())
      .then((data) => setTopTokens(data));
  // https://quote-api.jup.ag/v6/quote?inputMint= &outputMint= &amount= &slippageBps=
  useEffect(() => {
    getTokens();
    const inv = setInterval(() => {
      setLoadResp(true);
      fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${
          amount * 1000000000
        }&slippageBps=${slippageBps}`
      )
        .then((res) => res.json())
        .then((data) => {
          setQueryResponse(data);
          setLoadResp(false);
        });
    }, 3000);

    return () => clearInterval(inv);
  }, [amount, inputMint, outputMint, slippageBps]);

  const buyThispls = async () => {
    // 钱包用户签名
    if (signMessage) {
      signMessage(new TextEncoder().encode("hello world"));
    }

    // 获取swap的transactions
    const transactions = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // 参考jupiter官网接口负载
          asLegacyTransaction: false,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 1,
          wrapAndUnwrapSol: true,
          // /quote接口的响应
          quoteResponse: queryResponse,
          userPublicKey: publicKey?.toString(),
        }),
      })
    ).json();

    // 将swapTransaction转成Buffer
    const { swapTransaction } = transactions;
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    // 反序列化
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    // 签名
    const signTrans = await signTransaction?.(transaction);
    // 序列化
    const rawTransaction = signTrans?.serialize();
    // 钱包交互
    // sendRawTransaction 交易提示 Transaction loads an address table account that doesn't exist
    connection
      .sendRawTransaction(rawTransaction!, {
        skipPreflight: true,
        maxRetries: 2,
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <div className="px-6 flex flex-col gap-2">
        <div>
          inputMint:
          <Input
            className="px-3 py-2"
            defaultValue={inputMint}
            onChange={(e) => setInputMint(e.target.value)}
          />
        </div>
        <div>
          outputMint:
          <Input
            className="px-3 py-2"
            defaultValue={outputMint}
            onChange={(e) => setOutputMint(e.target.value)}
          />
        </div>
        <div>
          amount:
          <Input
            className="px-3 py-2"
            defaultValue={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          slippageBps:
          <Input
            className="px-3 py-2"
            defaultValue={slippageBps}
            onChange={(e) => setSlippageBps(Number(e.target.value))}
          />
        </div>
      </div>
      {(queryResponse && !loadResp && (
        <>
          <div className="px-6">
            <div>outAmount:</div>
            <Input defaultValue={queryResponse.outAmount} readOnly />
          </div>
          <div className="m-3 px-6 flex flex-col gap-2">
            <Button onClick={() => buyThispls()}>买买买</Button>
          </div>
        </>
      )) || (
        <>
          <div className="px-6">
            <div>outAmount:</div>
            <Skeleton className="h-[40px] bg-white w-full" />
          </div>
          <div className="m-3 px-6 flex flex-col gap-2">
            <Skeleton className="h-[40px] bg-slate-500 w-full" />
          </div>
        </>
      )}
    </div>
  );
};
