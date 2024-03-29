interface MintAmounts {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
}
interface SwapInfo extends MintAmounts {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}
interface Quote extends MintAmounts {
  platformFee: string | null;
  otherAmountThreshold: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: SwapInfo;
    percent: number;
  }>;
}

export type { Quote };
