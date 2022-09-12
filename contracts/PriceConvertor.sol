// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getPrice(AggregatorV3Interface priceFeed)  view internal returns(uint256) {
        (,int256 answer,,,) = priceFeed.latestRoundData();
        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) view internal returns(uint256){
        uint256 price = getPrice(priceFeed);
        uint256 convertedValue = (ethAmount * price) / 1e18;
        return uint256(convertedValue);
    }
}