const {getNamedAccounts, ethers} = require("hardhat");


async function main() {
  const {deployer} = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe",deployer);
  console.log("funding the contract...");
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("got the funds!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
