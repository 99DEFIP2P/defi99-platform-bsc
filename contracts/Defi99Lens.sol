pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

import "./DErc20.sol";
import "./DToken.sol";
import "./PriceOracle.sol";
import "./EIP20Interface.sol";
import "./Defi99Plus.sol";

interface DControllerLensInterface {
    function markets(address) external view returns (bool, uint256);

    function oracle() external view returns (PriceOracle);

    function getAccountLiquidity(address)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );

    function getAssetsIn(address) external view returns (DToken[] memory);

    function claimDefi99Plus(address) external;

    function defi99Accrued(address) external view returns (uint256);
}

contract Defi99Lens {
    struct DTokenMetadata {
        address dToken;
        uint256 exchangeRateCurrent;
        uint256 supplyRatePerBlock;
        uint256 borrowRatePerBlock;
        uint256 reserveFactorMantissa;
        uint256 totalBorrows;
        uint256 totalReserves;
        uint256 totalSupply;
        uint256 totalCash;
        bool isListed;
        uint256 collateralFactorMantissa;
        address underlyingAssetAddress;
        uint256 dTokenDecimals;
        uint256 underlyingDecimals;
    }

    function dTokenMetadata(DToken dToken)
        public
        returns (DTokenMetadata memory)
    {
        uint256 exchangeRateCurrent = dToken.exchangeRateCurrent();
        DControllerLensInterface dController =
            DControllerLensInterface(address(dToken.dController()));
        (bool isListed, uint256 collateralFactorMantissa) =
            dController.markets(address(dToken));
        address underlyingAssetAddress;
        uint256 underlyingDecimals;

        if (defi99areStrings(dToken.symbol(), "dBNB")) {
            underlyingAssetAddress = address(0);
            underlyingDecimals = 18;
        } else {
            DErc20 cErc20 = DErc20(address(dToken));
            underlyingAssetAddress = cErc20.underlying();
            underlyingDecimals = EIP20Interface(cErc20.underlying()).decimals();
        }

        return
            DTokenMetadata({
                dToken: address(dToken),
                exchangeRateCurrent: exchangeRateCurrent,
                supplyRatePerBlock: dToken.supplyRatePerBlock(),
                borrowRatePerBlock: dToken.borrowRatePerBlock(),
                reserveFactorMantissa: dToken.reserveFactorMantissa(),
                totalBorrows: dToken.totalBorrows(),
                totalReserves: dToken.totalReserves(),
                totalSupply: dToken.totalSupply(),
                totalCash: dToken.getCash(),
                isListed: isListed,
                collateralFactorMantissa: collateralFactorMantissa,
                underlyingAssetAddress: underlyingAssetAddress,
                dTokenDecimals: dToken.decimals(),
                underlyingDecimals: underlyingDecimals
            });
    }

    function dTokenMetadataAll(DToken[] calldata dTokens)
        external
        returns (DTokenMetadata[] memory)
    {
        uint256 dTokenCount = dTokens.length;
        DTokenMetadata[] memory res = new DTokenMetadata[](dTokenCount);
        for (uint256 i = 0; i < dTokenCount; i++) {
            res[i] = dTokenMetadata(dTokens[i]);
        }
        return res;
    }

    struct DTokenBalances {
        address dToken;
        uint256 balanceOf;
        uint256 borrowBalanceCurrent;
        uint256 balanceOfUnderlying;
        uint256 tokenBalance;
        uint256 tokenAllowance;
    }

    function dTokenBalances(DToken dToken, address payable account)
        public
        returns (DTokenBalances memory)
    {
        uint256 balanceOf = dToken.balanceOf(account);
        uint256 borrowBalanceCurrent = dToken.borrowBalanceCurrent(account);
        uint256 balanceOfUnderlying = dToken.balanceOfUnderlying(account);
        uint256 tokenBalance;
        uint256 tokenAllowance;

        if (defi99areStrings(dToken.symbol(), "dBNB")) {
            tokenBalance = account.balance;
            tokenAllowance = account.balance;
        } else {
            DErc20 cErc20 = DErc20(address(dToken));
            EIP20Interface underlying = EIP20Interface(cErc20.underlying());
            tokenBalance = underlying.balanceOf(account);
            tokenAllowance = underlying.allowance(account, address(dToken));
        }

        return
            DTokenBalances({
                dToken: address(dToken),
                balanceOf: balanceOf,
                borrowBalanceCurrent: borrowBalanceCurrent,
                balanceOfUnderlying: balanceOfUnderlying,
                tokenBalance: tokenBalance,
                tokenAllowance: tokenAllowance
            });
    }

    function dTokenBalancesAll(
        DToken[] calldata dTokens,
        address payable account
    ) external returns (DTokenBalances[] memory) {
        uint256 dTokenCount = dTokens.length;
        DTokenBalances[] memory res = new DTokenBalances[](dTokenCount);
        for (uint256 i = 0; i < dTokenCount; i++) {
            res[i] = dTokenBalances(dTokens[i], account);
        }
        return res;
    }

    struct DTokenUnderlyingPrice {
        address dToken;
        uint256 underlyingPrice;
    }

    function dTokenUnderlyingPrice(DToken dToken)
        public
        returns (DTokenUnderlyingPrice memory)
    {
        DControllerLensInterface dController =
            DControllerLensInterface(address(dToken.dController()));
        PriceOracle priceOracle = dController.oracle();

        return
            DTokenUnderlyingPrice({
                dToken: address(dToken),
                underlyingPrice: priceOracle.getUnderlyingPrice(dToken)
            });
    }

    function dTokenUnderlyingPriceAll(DToken[] calldata dTokens)
        external
        returns (DTokenUnderlyingPrice[] memory)
    {
        uint256 dTokenCount = dTokens.length;
        DTokenUnderlyingPrice[] memory res =
            new DTokenUnderlyingPrice[](dTokenCount);
        for (uint256 i = 0; i < dTokenCount; i++) {
            res[i] = dTokenUnderlyingPrice(dTokens[i]);
        }
        return res;
    }

    struct AccountLimits {
        DToken[] markets;
        uint256 liquidity;
        uint256 shortfall;
    }

    function getAccountLimits(
        DControllerLensInterface dController,
        address account
    ) public returns (AccountLimits memory) {
        (uint256 errorCode, uint256 liquidity, uint256 shortfall) =
            dController.getAccountLiquidity(account);
        require(errorCode == 0);

        return
            AccountLimits({
                markets: dController.getAssetsIn(account),
                liquidity: liquidity,
                shortfall: shortfall
            });
    }

    struct Defi99BalanceMetadata {
        uint256 balance;
    }

    function getDefi99BalanceMetadata(Defi99Plus defi99Plus, address account)
        external
        view
        returns (Defi99BalanceMetadata memory)
    {
        return Defi99BalanceMetadata({balance: defi99Plus.balanceOf(account)});
    }

    struct Defi99BalanceMetadataExt {
        uint256 balance;
        uint256 allocated;
    }

    function getDefi99BalanceMetadataExt(
        Defi99Plus defi99Plus,
        DControllerLensInterface dController,
        address account
    ) external returns (Defi99BalanceMetadataExt memory) {
        uint256 balance = defi99Plus.balanceOf(account);
        dController.claimDefi99Plus(account);
        uint256 newBalance = defi99Plus.balanceOf(account);
        uint256 accrued = dController.defi99Accrued(account);
        uint256 total = add(accrued, newBalance, "sum defi99Plus total");
        uint256 allocated = sub(total, balance, "sub allocated");

        return
            Defi99BalanceMetadataExt({balance: balance, allocated: allocated});
    }

    function defi99areStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function add(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, errorMessage);
        return c;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }
}
