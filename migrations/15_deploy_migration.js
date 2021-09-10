require("dotenv").config();
const verify = require("../src/verify");

const DErc20WBTCDelegate = artifacts.require("DErc20WBTCDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 DErc20WBTCDelegate */
    /* await deployer.deploy(DErc20WBTCDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20WBTCDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};
