require("dotenv").config();
const verify = require("../src/verify");

const Defi99Plus = artifacts.require("Defi99Plus");

// Address for transferring Defi99Plus Token
const ADMIN_ADDRESS = "0xD565C800C1611Bed28911D5A819f1E6A9E0d3d7f"

module.exports = async (deployer, network) => {

    /* Deploy Defi99Plus Contract */
    /*await deployer.deploy(Defi99Plus, ADMIN_ADDRESS);

    if (network !== "development")
        await verify.bscscanVerify(
            Defi99Plus,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};