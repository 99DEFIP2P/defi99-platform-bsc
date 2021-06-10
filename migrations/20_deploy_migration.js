require("dotenv").config();
const verify = require("../src/verify");

const DErc20LINKDelegate = artifacts.require("DErc20LINKDelegate");
const DErc20LINKDelegator = artifacts.require("DErc20LINKDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dLINK
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {
    let LINK_TOKEN_ADDRESS = "0x5AA034CCBDFc3CF8cbDe2711bf9C3fd90B96F24B";

    /* Deploy 99defi LINK */
    await deployer.deploy(
        DErc20LINKDelegator,
        LINK_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi LINK",
        "dLINK",
        8,
        ADMIN_ADDRESS,
        DErc20LINKDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20LINKDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};