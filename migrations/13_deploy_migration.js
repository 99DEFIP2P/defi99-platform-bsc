require("dotenv").config();
const verify = require("../src/verify");

const DErc20BATDelegate = artifacts.require("DErc20BATDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 DErc20BATDelegate */
    await deployer.deploy(DErc20BATDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20BATDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};