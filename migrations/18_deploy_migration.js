require("dotenv").config();
const verify = require("../src/verify");

const DErc20ZRXDelegate = artifacts.require("DErc20ZRXDelegate");
const DErc20ZRXDelegator = artifacts.require("DErc20ZRXDelegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dZRX
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {
    let ZRX_TOKEN_ADDRESS = "0x6249Cd2d84d9ABB89DD0Ef115Cd334569a50DA8C";

    /* Deploy 99defi ZRX */
    await deployer.deploy(
        DErc20ZRXDelegator,
        ZRX_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi BZRX",
        "dBZRX",
        8,
        ADMIN_ADDRESS,
        DErc20ZRXDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20ZRXDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};