require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");
require("hardhat-deploy")

const API_KEY = process.env.API_KEY;
const RINKEBY_URL = process.env.RPC_URL;
const ACCOUNT = process.env.PRIVATE_KEY;
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork : "hardhat",
    networks : {
      rinkeby : {
        url : RINKEBY_URL,
        accounts : [ACCOUNT],
        chainId : 4,
        blockConfirmation: 6,
      },
      localhost : {
        url : "http://127.0.0.1:8545/",
        chainId : 31337
      }
    },
  etherscan : {
    apiKey :  API_KEY,
  },
  gasReporter : {
    enabled : true,
    noColors : true,
    currency : "USD",
    //coinmarketcap : COINMARKET_API_KEY,
    outputFile : "gas-report.txt"
  },
  solidity: {
    compilers: [
        {
            version: "0.8.8",
        },
        {
            version: "0.7.0",
        },
    ],
  },
  namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
          1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};