require("dotenv").config();
const verify = require("../src/verify");

const DErc20BATDelegate = artifacts.require("DErc20BATDelegate");
const DErc20BATDelegator = artifacts.require("DErc20BATDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dBAT
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {
    let BAT_TOKEN_ADDRESS = "0x9C222c2bBb317cAB4103dE8D7b0D273b5e949321";

    /* Deploy 99defi BAT */
    await deployer.deploy(
        DErc20BATDelegator,
        BAT_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi BAT",
        "dBAT",
        8,
        ADMIN_ADDRESS,
        DErc20BATDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20BATDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};