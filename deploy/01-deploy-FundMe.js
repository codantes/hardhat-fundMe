const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../hardhat-helper-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`FundMe deployed at ${fundMe.address}`);
    
    if(!developmentChains.includes(network.name) && process.env.API_KEY){
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
    console.log("----------------------------------------------------");

}

module.exports.tags = ["all", "fundme"]