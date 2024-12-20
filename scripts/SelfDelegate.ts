import { viem } from "hardhat";
import {
  parseEther,
  formatEther,
} from "viem";
import * as dotenv from "dotenv";

dotenv.config();

const contractAddress = process.env.CONTRACT_ADDRESS_ERC20 || "";
const contractName = "MyToken";

// const MINT_VALUE = parseEther("10");

async function main() {
  const publicClient = await viem.getPublicClient();
  const [_, account2] = await viem.getWalletClients();

  // const proposals = ["arg1", "arg2", "arg3"];

  const tokenContract = await viem.getContractAt(
    contractName as string,
    contractAddress as `0x${string}`,
    { client: { wallet: account2 } }
  );
  console.log(`MyToken was deployed at ${tokenContract.address}`);

  // Check token balance
  const balanceBN = await tokenContract.read.balanceOf([
    account2.account.address,
  ]) as bigint;

  console.log(
    `Account ${account2.account.address
    } has ${formatEther(balanceBN)} units of MyToken\n`
  );

  const votesBefore = await tokenContract.read.getVotes([account2.account.address]) as bigint;
  console.log(
    `Account ${account2.account.address
    } has ${formatEther(votesBefore)} units of voting power before self delegating\n`
  );

  // Delegate voting power
  const delegateTx = await tokenContract.write.delegate([account2.account.address], {
    account: account2.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  const votesAfter = await tokenContract.read.getVotes([account2.account.address]) as bigint;
  console.log(
    `Account ${account2.account.address
    } has ${formatEther(votesAfter)} units of voting power after self delegating\n`
  );
}


main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
