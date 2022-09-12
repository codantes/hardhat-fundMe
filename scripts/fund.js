const {getNamedAccounts, ethers} = require("hardhat");


async function main() {
  const {deployer} = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe",deployer);
  const sendValue = ethers.utils.parseEther("2");
  console.log("funding the contract...");
  const transactionResponse = await fundMe.fund({value: sendValue});
  await transactionResponse.wait(1);
  console.log("contract funded!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
