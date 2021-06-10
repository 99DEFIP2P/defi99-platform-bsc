require("dotenv").config();
const verify = require("../src/verify");

const DErc20WBTCDelegate = artifacts.require("DErc20WBTCDelegate");
const DErc20WBTCDelegator = artifacts.require("DErc20WBTCDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dWBTC
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {
    let WBTC_TOKEN_ADDRESS = "0x3E090FfB054d69c32f8129D55F64B0047224204F";

    /* Deploy 99defi WBTC */
    await deployer.deploy(
        DErc20WBTCDelegator,
        WBTC_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi WBTC",
        "dWBTC",
        8,
        ADMIN_ADDRESS,
        DErc20WBTCDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20WBTCDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};