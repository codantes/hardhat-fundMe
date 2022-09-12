const { deployments, ethers, getNamedAccounts } = require("hardhat");
const {assert, expect} = require("chai");
const {developmentChains} = require("../../hardhat-helper-config");

!
developmentChains.includes(network.name) ? describe.skip :
describe("fund me", async function() {
    let fundMe, deployer, MockV3Aggregator;
    const sendValue =  ethers.utils.parseEther("1");
    beforeEach(async function(){
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    })

    describe("contructor", async function(){
        it("sets aggregator correctly", async function(){
            const response = await fundMe.priceFeed();
            assert.equal(response, MockV3Aggregator.address);
        })        
    })

    describe("fund", async function(){
        it("fails if not sent enough ETH", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("not enough eth");
        })

        it("updates the sent value", async function(){
            await fundMe.fund({value: sendValue})
            const response = await fundMe.addressToAmount(deployer);
            assert.equal(response.toString(), sendValue.toString());
        })

        it("add funders to an array", async function(){
            await fundMe.fund({value: sendValue})
            const response = await fundMe.funders(0);
            assert.equal(response, deployer);
        })
    })

    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
        })

        it("withdraws the funds", async function(){
            const fundMeStartingbalance = await ethers.provider.getBalance(fundMe.address);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);

            const transactionResponse = await fundMe.withdraw();
            const transactionReciept = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReciept;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.address);
            const deployerEndingBalance = await ethers.provider.getBalance(deployer);

            assert.equal(fundMeEndingBalance.toString(),"0");
            assert.equal(fundMeStartingbalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gasCost).toString())
        })

        it("withdraws funds from multiple funders", async function(){
            //arange
            const accounts = await ethers.getSigners();
            for(let i = 1; i <=6 ; i++){
                const fundMeConectedContract = await fundMe.connect(accounts[i]);
                await fundMeConectedContract.fund({value: sendValue});
            }

            const fundMeStartingbalance = await ethers.provider.getBalance(fundMe.address);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);
            
            //act
            const transactionResponse = await fundMe.withdraw();
            const transactionReciept = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReciept;
            const gasCost = gasUsed.mul(effectiveGasPrice);
            
            const fundMeEndingBalance = await ethers.provider.getBalance(fundMe.address);
            const deployerEndingBalance = await ethers.provider.getBalance(deployer);
            
            //assert
            assert.equal(fundMeEndingBalance.toString(),"0");
            assert.equal(fundMeStartingbalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gasCost).toString())
            await expect(fundMe.funders(0)).to.be.reverted

        })

        it("only owner is allowed to withdraw", async function(){
            const accounts = await ethers.getSigners();
            const attacker = accounts[5];
            const fundMeConectedContract = await fundMe.connect(attacker);
            await expect(fundMeConectedContract.withdraw()).to.be.reverted;
        })
    })
})