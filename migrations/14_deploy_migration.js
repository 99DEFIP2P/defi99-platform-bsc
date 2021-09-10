require("dotenv").config();
const verify = require("../src/verify");

const DErc20BATDelegate = artifacts.require("DErc20BATDelegate");
const DErc20BATDelegator = artifacts.require("DErc20BATDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dBAT
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

module.exports = async (deployer, network) => {
    let BAT_TOKEN_ADDRESS = "0x101d82428437127bf1608f699cd651e6abf9766e";

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
