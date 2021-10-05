/**
 * Hello world
 */

import {
  establishConnection,
  establishPayer,
  checkProgram,
  mint,
} from './token';

async function main() {
  // Establish connection to the cluster
  await establishConnection();

  await establishPayer();

  await checkProgram();

  await mint(new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0]));

  console.log('Success');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
