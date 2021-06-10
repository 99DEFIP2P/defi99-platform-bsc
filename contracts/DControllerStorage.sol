pragma solidity ^0.5.16;

import "./DToken.sol";
import "./PriceOracle.sol";

contract Defi99AdminStorage {
    /**
    * @notice Administrator for this contract
    */
    address public admin;

    /**
    * @notice Pending administrator for this contract
    */
    address public pendingAdmin;

    /**
    * @notice Active brains of Defi99
    */
    address public implementation;

    /**
    * @notice Pending brains of Defi99
    */
    address public pendingImplementation;
}

contract DControllerV1Storage is Defi99AdminStorage {

    /**
     * @notice Oracle which gives the price of any given asset
     */
    PriceOracle public oracle;

    /**
     * @notice Multiplier used to calculate the maximum repayAmount when liquidating a borrow
     */
    uint public closeFactorMantissa;

    /**
     * @notice Multiplier representing the discount on collateral that a liquidator receives
     */
    uint public liquidationIncentiveMantissa;

    /**
     * @notice Max number of assets a single account can participate in (borrow or use as collateral)
     */
    uint public maxAssets;

    /**
     * @notice Per-account mapping of "assets you are in", capped by maxAssets
     */
    mapping(address => DToken[]) public accountAssets;

}

contract DControllerV2Storage is DControllerV1Storage {
    struct Market {
        /// @notice Whether or not this market is listed
        bool isListed;

        /**
         * @notice Multiplier representing the most one can borrow against their collateral in this market.
         *  For instance, 0.9 to allow borrowing 90% of collateral value.
         *  Must be between 0 and 1, and stored as a mantissa.
         */
        uint collateralFactorMantissa;

        /// @notice Per-market mapping of "accounts in this asset"
        mapping(address => bool) accountMembership;

        /// @notice Whether or not this market receives BRID+
        bool isDefi99;
    }

    /**
     * @notice Official mapping of dTokens -> Market metadata
     * @dev Used e.g. to determine if a market is supported
     */
    mapping(address => Market) public markets;


    /**
     * @notice The Pause Guardian can pause certain actions as a safety mechanism.
     *  Actions which allow users to remove their own assets cannot be paused.
     *  Liquidation / seizing / transfer can only be paused globally, not by market.
     */
    address public pauseGuardian;
    bool public _mintGuardianPaused;
    bool public _borrowGuardianPaused;
    bool public transferGuardianPaused;
    bool public seizeGuardianPaused;
    mapping(address => bool) public mintGuardianPaused;
    mapping(address => bool) public borrowGuardianPaused;
}

contract DControllerV3Storage is DControllerV2Storage {
    struct Defi99MarketState {
        /// @notice The market's last updated defi99BorrowIndex or defi99SupplyIndex
        uint224 index;

        /// @notice The block number the index was last updated at
        uint32 block;
    }

    address defi99Address;

    /// @notice A list of all markets
    DToken[] public allMarkets;

    /// @notice The rate at which the flywheel distributes COMP, per block
    uint public defi99Rate;

    /// @notice The portion of defi99Rate that each market currently receives
    mapping(address => uint) public defi99Speeds;

    /// @notice The COMP market supply state for each market
    mapping(address => Defi99MarketState) public defi99SupplyState;

    /// @notice The COMP market borrow state for each market
    mapping(address => Defi99MarketState) public defi99BorrowState;

    /// @notice The COMP borrow index for each market for each supplier as of the last time they accrued COMP
    mapping(address => mapping(address => uint)) public defi99SupplierIndex;

    /// @notice The COMP borrow index for each market for each borrower as of the last time they accrued COMP
    mapping(address => mapping(address => uint)) public defi99BorrowerIndex;

    /// @notice The COMP accrued but not yet transferred to each user
    mapping(address => uint) public defi99Accrued;
}