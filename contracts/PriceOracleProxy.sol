pragma solidity ^0.5.16;

import "./DErc20.sol";
import "./DToken.sol";
import "./PriceOracle.sol";

interface V1PriceOracleInterface {
    function assetPrices(address asset) external view returns (uint256);
}

contract PriceOracleProxy is PriceOracle {
    /// @notice Indicator that this is a PriceOracle contract (for inspection)
    bool public constant isPriceOracle = true;

    /// @notice The v1 price oracle, which will continue to serve prices for v1 assets
    V1PriceOracleInterface public v1PriceOracle;

    /// @notice Address of the guardian, which may set the SAI price once
    address public guardian;

    /// @notice Address of the dUSDC contract, which we hand pick a key for
    address public dUsdcAddress;

    /// @notice Address of the dUSDT contract, which uses the dUSDC price
    address public dUsdtAddress;

    /// @notice Address of the dDAI contract, which we hand pick a key for
    address public dDaiAddress;

    /// @notice Handpicked key for USDC
    address public constant usdcOracleKey = address(1);

    /// @notice Handpicked key for DAI
    address public constant daiOracleKey = address(2);

    /**
     * @param guardian_ The address of the guardian, which may set the SAI price once
     * @param v1PriceOracle_ The address of the v1 price oracle, which will continue to operate and hold prices for collateral assets
     * @param dUsdcAddress_ The address of dUSDC, which will be read from a special oracle key
     * @param dDaiAddress_ The address of dDAI, which will be read from a special oracle key
     * @param dUsdtAddress_ The address of dUSDT, which uses the dUSDC price
     */
    constructor(
        address guardian_,
        address v1PriceOracle_,
        address dUsdcAddress_,
        address dDaiAddress_,
        address dUsdtAddress_
    ) public {
        guardian = guardian_;
        v1PriceOracle = V1PriceOracleInterface(v1PriceOracle_);

        dUsdcAddress = dUsdcAddress_;
        dDaiAddress = dDaiAddress_;
        dUsdtAddress = dUsdtAddress_;
    }

    /**
     * @notice Get the underlying price of a listed dToken asset
     * @param dToken The dToken to get the underlying price of
     * @return The underlying asset price mantissa (scaled by 1e18)
     */
    function getUnderlyingPrice(DToken dToken) public view returns (uint256) {
        address dTokenAddress = address(dToken);

        if (dTokenAddress == dUsdcAddress || dTokenAddress == dUsdtAddress) {
            return v1PriceOracle.assetPrices(usdcOracleKey);
        }

        if (dTokenAddress == dDaiAddress) {
            return v1PriceOracle.assetPrices(daiOracleKey);
        }

        // otherwise just read from v1 oracle
        address underlying = DErc20(dTokenAddress).underlying();
        return v1PriceOracle.assetPrices(underlying);
    }
}
