require("dotenv").config();
const verify = require("../src/verify");

const Defi99Plus = artifacts.require("Defi99Plus");

// Address for transferring Defi99Plus Token
const ADMIN_ADDRESS = "0x4089bA22DE13C07Ff418D8f76E90ff1940936CB4"

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
