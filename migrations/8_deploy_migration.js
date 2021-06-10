require("dotenv").config();
const verify = require("../src/verify");

const DErc20USDCDelegate = artifacts.require("DErc20USDCDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 Erc20USDCDelegate */
    await deployer.deploy(DErc20USDCDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20USDCDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};