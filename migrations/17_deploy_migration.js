require("dotenv").config();
const verify = require("../src/verify");

const DErc20ZRXDelegate = artifacts.require("DErc20ZRXDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 DErc20ZRXDelegate */
    /* await deployer.deploy(DErc20ZRXDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20ZRXDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};
