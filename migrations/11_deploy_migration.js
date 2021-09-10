require("dotenv").config();
const verify = require("../src/verify");

const DErc20Delegate = artifacts.require("DErc20Delegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 Erc20Delegate */
    /* await deployer.deploy(DErc20Delegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20Delegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};
