require("dotenv").config();
const verify = require("../src/verify");

const DBNB = artifacts.require("DBNB");
const Defi99Core = artifacts.require("Defi99Core");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying dBNB
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

module.exports = async (deployer, network) => {

    /* Deploy 99defi BNB */
    await deployer.deploy(
        DBNB,
        Defi99Core.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "99defi BNB",
        "dBNB",
        8,
        ADMIN_ADDRESS
    );

    if (network !== "development")
        await verify.bscscanVerify(
            DBNB,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};
