require("dotenv").config();
const verify = require("../src/verify");

const DErc20DEFI99Delegate = artifacts.require("DErc20DEFI99Delegate");
const DErc20DEFI99Delegator = artifacts.require("DErc20DEFI99Delegator");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dDEFI99
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {
    let DEFI99_TOKEN_ADDRESS = "0xd5cf8d4e332667ded826fdb758a2b3dda98d600b";

    /* Deploy Defi99 DEFI99 */
    await deployer.deploy(
        DErc20DEFI99Delegator,
        DEFI99_TOKEN_ADDRESS,
        Defi99Core.address,
        JumpRateModel.address,
        "20000000000000000",
        "99defi 99DEFI",
        "dDEFI99",
        8,
        ADMIN_ADDRESS,
        DErc20DEFI99Delegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20DEFI99Delegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};