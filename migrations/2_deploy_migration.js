require("dotenv").config();
const verify = require("../src/verify");

const Defi99InterestRateModel = artifacts.require("Defi99InterestRateModel");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 Interest Model */
    await deployer.deploy(
        Defi99InterestRateModel,
        "20000000000000000",
        "100000000000000000"
    );

    if (network !== "development")
        await verify.bscscanVerify(
            Defi99InterestRateModel,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};