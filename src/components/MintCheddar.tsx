import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { useState } from "react"
import { cheddarMinterABI } from "@/contracts/cheddarMinterABI"

export default function MintCheddar() {
  const { primaryWallet } = useDynamicContext()

  const [txnHash, setTxnHash] = useState("")

  if(!primaryWallet || !isEthereumWallet(primaryWallet)) return null

  const mint = async () => {
    const publicClient = await primaryWallet.getPublicClient()
    const walletClient = await primaryWallet.getWalletClient()

    const [account] = await walletClient.getAddresses()

    const { request } = await publicClient.simulateContract({
      account,
      address: "0x221659fcCb17E731b79e0fAb7b3128453360E6E4",
      abi: cheddarMinterABI,
      functionName: "mint",
      args: ["0x136ab2015e8bbaEb8066c3C84ADFf39bF9785F6c", BigInt(100), "0x013bF643683386B900CFE6D3B4263CB57780330a"]
    })

    const txnHash = await walletClient.writeContract(request)

    setTxnHash(txnHash)

    console.log("mint hash", txnHash)
  }
  return (
    <button style={{width: "100px", height: "20px", backgroundColor: "orange"}} onClick={mint}>
      Mint Cheddar
    </button>
  )
}