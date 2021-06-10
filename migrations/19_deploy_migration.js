require("dotenv").config();
const verify = require("../src/verify");

const DErc20LINKDelegate = artifacts.require("DErc20LINKDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 DErc20LINKDelegate */
    await deployer.deploy(DErc20LINKDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20LINKDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};