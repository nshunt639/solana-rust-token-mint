/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import path from "path";

import { getPayer, getRpcUrl, createKeypairFromFile } from "./utils";

let connection: Connection;
let payer: Keypair;
let programId: PublicKey;

const PROGRAM_PATH = path.resolve(__dirname, "../../dist/program");
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, "token.so");
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, "token-keypair.json");

export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", rpcUrl, version);
}

export async function establishPayer(): Promise<void> {
  payer = await getPayer();
}

export async function checkProgram(): Promise<void> {
  const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
  programId = programKeypair.publicKey;

  console.log(`Using program ${programId.toBase58()}`);
}

export async function mint(amount: Uint8Array): Promise<void> {
  const token: Token = await Token.createMint(
    connection,
    payer,
    programId,
    null,
    9,
    TOKEN_PROGRAM_ID
  );

  let associatedTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    payer.publicKey
  );

  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: token.publicKey, isSigner: false, isWritable: false },
      {
        pubkey: associatedTokenAccount.address,
        isSigner: false,
        isWritable: true,
      },
    ],
    data: Buffer.from(amount),
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer]
  );
}
