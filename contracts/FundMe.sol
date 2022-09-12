// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PriceConvertor.sol";

error notOwner();

contract FundMe{
    using PriceConvertor for uint256;

    uint256 public constant minimunUsd = 50 * 1e18; 
    address[] public funders;
    mapping (address => uint256) public addressToAmountFunded;
    address public immutable owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress){
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable{
        require(msg.value.getConversionRate(priceFeed) >= minimunUsd, "not enough eth");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public ownership{
        for(uint256 fundersIndex = 0; fundersIndex < funders.length; fundersIndex++){
            address funder = funders[fundersIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        //transfer
        //payable(msg.sender).transfer(address(this).balance);

        //send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require(sendSuccess, "send unsuccessfull");

        //call
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call unsuccessful"); 
    }

    function addressToAmount(address funder)public view returns(uint256){
        return addressToAmountFunded[funder];
    }

    modifier ownership {
        //require(msg.sender == owner, "sender is not the owner");
        if(msg.sender != owner){ revert notOwner(); }
        _;        
    }

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }
}