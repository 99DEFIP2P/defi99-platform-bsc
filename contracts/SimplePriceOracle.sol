pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

import "./PriceOracle.sol";
import "./DErc20.sol";

contract SimplePriceOracle is PriceOracle {
    address public admin;
    address public pendingAdmin;
    mapping(string => address) defiTokens;
    mapping(address => uint256) prices;
    event PricePosted(
        string symbol,
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );

    constructor() public {
        admin = msg.sender;
    }

    function initialiseTokens(string[] memory symbols, address[] memory dTokens)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);
        require(symbols.length == dTokens.length);

        // Associate symbols with tokens
        for (uint256 i = 0; i < symbols.length; i++) {
            defiTokens[symbols[i]] = dTokens[i];
        }
    }

    function postPrices(string[] memory symbols, uint256[] memory priceMantissa)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);
        require(symbols.length == priceMantissa.length);

        // Post prices
        for (uint256 i = 0; i < symbols.length; i++) {
            if (compareStrings(symbols[i], "BNB")) {
                setDirectPrice(
                    address(defiTokens[symbols[i]]),
                    priceMantissa[i]
                );
            } else {
                setUnderlyingPrice(
                    DToken(defiTokens[symbols[i]]),
                    priceMantissa[i]
                );
            }
        }
    }

    function getUnderlyingPrice(DToken dToken) public view returns (uint256) {
        if (compareStrings(dToken.symbol(), "dBNB")) {
            return prices[address(dToken)];
        } else {
            return prices[address(DErc20(address(dToken)).underlying())];
        }
    }

    function setUnderlyingPrice(DToken dToken, uint256 underlyingPriceMantissa)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);

        address asset = address(DErc20(address(dToken)).underlying());

        emit PricePosted(
            dToken.symbol(),
            address(dToken),
            prices[asset],
            underlyingPriceMantissa,
            underlyingPriceMantissa
        );
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint256 price) public {
        // Check caller = admin
        require(msg.sender == admin);

        emit PricePosted("dBNB", asset, prices[asset], price, price);
        prices[asset] = price;
    }

    // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint256) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function _setPendingAdmin(address newPendingAdmin) public {
        // Check caller = admin
        require(msg.sender == admin);

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;
    }

    function _acceptAdmin() public {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0));

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);
    }
}
