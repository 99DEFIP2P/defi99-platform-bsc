require("dotenv").config();
const verify = require("../src/verify");

const DErc20Delegate = artifacts.require("DErc20Delegate");
const DErc20Delegator = artifacts.require("DErc20Delegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dUSDT
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

module.exports = async (deployer, network) => {
    let USDT_TOKEN_ADDRESS = "0xe93e5891b1b757D51D20448F2803Db4Cd6f84233";

    /* Deploy 99defi USDT */
    /*await deployer.deploy(
        DErc20Delegator,
        USDT_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi USDT",
        "dUSDT",
        8,
        ADMIN_ADDRESS,
        DErc20Delegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20Delegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );*/
};
