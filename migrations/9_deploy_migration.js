require("dotenv").config();
const verify = require("../src/verify");

const DErc20USDCDelegate = artifacts.require("DErc20USDCDelegate");
const DErc20USDCDelegator = artifacts.require("DErc20USDCDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dUSDC
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

module.exports = async (deployer, network) => {
    let USDC_TOKEN_ADDRESS = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

    /* Deploy Defi99 USDC */
    await deployer.deploy(
        DErc20USDCDelegator,
        USDC_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi USDC",
        "dUSDC",
        8,
        ADMIN_ADDRESS,
        DErc20USDCDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20USDCDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};
