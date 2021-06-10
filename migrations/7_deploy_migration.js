require("dotenv").config();
const verify = require("../src/verify");

const DController = artifacts.require("DController");
const Defi99Core = artifacts.require("Defi99Core");

module.exports = async (deployer, network) => {

    /* Deploy Defi99 Controller */
    await deployer.deploy(DController);

    if (network !== "development")
        await verify.bscscanVerify(
            DController,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );

    console.log(Defi99Core.address)

    defi99CoreInstance = await Defi99Core.deployed();

    // Add DController as pending implementation in Defi99Core
    defi99CoreInstance._setPendingImplementation(DController.address);

    dControllerInstance = await DController.deployed();

    // Approve the implementation by calling _become in DController
    dControllerInstance._become(Defi99Core.address);
};