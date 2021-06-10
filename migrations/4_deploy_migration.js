require("dotenv").config();
const verify = require("../src/verify");

const Timelock = artifacts.require("Timelock");

// Admin address for Timelock
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {

    /* Deploy Timelock Contract */
    await deployer.deploy(
        Timelock,
        ADMIN_ADDRESS,
        172800
    );

    if (network !== "development")
        await verify.bscscanVerify(
            Timelock,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};