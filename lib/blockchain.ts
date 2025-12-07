import { createWalletClient, http, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { scrollSepolia } from "viem/chains"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY as `0x${string}`
const RPC_URL = process.env.RPC_URL

if (!CONTRACT_ADDRESS) {
  console.warn("NEXT_PUBLIC_CONTRACT_ADDRESS is not defined")
}

if (!PRIVATE_KEY) {
  console.warn("ADMIN_PRIVATE_KEY is not defined")
}

// Minimal ABI for minting
const ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "uri", type: "string" },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export async function mintNFT(toAddress: string, tokenURI: string) {
  if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error("Blockchain configuration missing (Contract Address or Private Key)")
  }

  const account = privateKeyToAccount(PRIVATE_KEY)

  const client = createWalletClient({
    account,
    chain: scrollSepolia,
    transport: http(RPC_URL),
  })

  const publicClient = createPublicClient({
    chain: scrollSepolia,
    transport: http(RPC_URL),
  })

  try {
    const { request } = await publicClient.simulateContract({
      account,
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "safeMint",
      args: [toAddress as `0x${string}`, tokenURI],
    })

    const hash = await client.writeContract(request)
    
    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    
    return {
      success: true,
      txHash: hash,
      blockNumber: receipt.blockNumber
    }
  } catch (error) {
    console.error("Error minting NFT:", error)
    throw error
  }
}
