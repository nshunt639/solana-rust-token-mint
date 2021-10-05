// use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    // program_error::ProgramError,
    pubkey::Pubkey,
    program::invoke_signed
};
use spl_token::{
    ID,
    instruction::mint_to
};

use std::convert::TryInto;

entrypoint!(process_instruction);

fn read_be_u64(input: &mut &[u8]) -> u64 {
    let (int_bytes, rest) = input.split_at(std::mem::size_of::<u64>());
    *input = rest;
    u64::from_be_bytes(int_bytes.try_into().unwrap())
}

pub fn process_instruction(
    program_id: &Pubkey,
    keys: &[AccountInfo],
    amount: &[u8],
) -> ProgramResult {
    msg!("Token Mint Rust program entrypoint");

    let iter = &mut keys.iter();

    let token = next_account_info(iter)?;
    let asociated_account = next_account_info(iter)?;

    invoke_signed(
        &mint_to(
            &ID,
            token.key,
            asociated_account.key,
            program_id,
            &[],
            amount[0] as u64
        )?,
        &[],
        &[],
    );

    msg!("Mint {} tokens!", std::str::from_utf8(amount).unwrap().to_string());

    Ok(())
}
