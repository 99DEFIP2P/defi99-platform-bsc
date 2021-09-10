require("dotenv").config();
const verify = require("../src/verify");

const DErc20DEFI99Delegate = artifacts.require("DErc20DEFI99Delegate");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 DErc20DEFI99Delegate */
    /* await deployer.deploy(DErc20DEFI99Delegate);

    if (network !== "development")
        await verify.bscscanVerify(
            DErc20DEFI99Delegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};
