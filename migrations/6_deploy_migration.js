require("dotenv").config();
const verify = require("../src/verify");

const Defi99Core = artifacts.require("Defi99Core");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 Core (Unitroller) */
    await deployer.deploy(Defi99Core);

    if (network !== "development")
        await verify.bscscanVerify(
            Defi99Core,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};