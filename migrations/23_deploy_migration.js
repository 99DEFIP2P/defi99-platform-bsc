require("dotenv").config();
const verify = require("../src/verify");

const Defi99Lens = artifacts.require("Defi99Lens");

module.exports = async (deployer, network) => {

    // /* Deploy Defi99Lens contract */
    await deployer.deploy(Defi99Lens);

    if (network !== "development")
        await verify.bscscanVerify(
            Defi99Lens,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};