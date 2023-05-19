import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

interface TransferSPLToken {
  connection: Connection
  wallet: AnchorWallet
  tokenMint: string
  destinationWallet: string
  amount: number
}

export const transferSplToken = async ({
  connection,
  wallet,
  tokenMint,
  destinationWallet,
  amount,
}: TransferSPLToken) => {
  const mint = new PublicKey(tokenMint)
  const source = await getAssociatedTokenAddress(mint, wallet.publicKey)
  const destinationWalletPublicKey = new PublicKey(destinationWallet)
  const destination = await getAssociatedTokenAddress(
    mint,
    destinationWalletPublicKey
  )

  let transaction = new Transaction({
    feePayer: wallet.publicKey,
  })

  try {
    await getAccount(connection, destination)
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          destination,
          destinationWalletPublicKey,
          mint
        )
      )
    } else {
      throw err
    }
  }

  transaction.add(
    createTransferCheckedInstruction(
      source,
      mint,
      destination,
      wallet.publicKey,
      BigInt(amount),
      0
    )
  )

  const latest = await connection.getLatestBlockhash()
  transaction.recentBlockhash = latest.blockhash
  transaction = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(transaction.serialize())
  await connection.confirmTransaction(signature, 'processed')
}
