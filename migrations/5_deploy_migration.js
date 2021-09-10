require("dotenv").config();
const verify = require("../src/verify");

const Timelock = artifacts.require("Timelock");

// Admin address for Timelock
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

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
