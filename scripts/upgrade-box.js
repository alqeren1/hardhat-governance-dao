const { ethers, deployments } = require("hardhat")

async function main() {
    const contractboxProxyAdmin = await deployments.get("BoxProxyAdmin")
    const boxProxyAdmin = await ethers.getContractAt(
        "BoxProxyAdmin",
        contractboxProxyAdmin.address,
    )
    const transparentProxy = await deployments.get("Box_Proxy")
    const proxyboxV1 = await ethers.getContractAt(
        "Box",
        transparentProxy.address,
    )
    const version = await proxyboxV1.version()
    console.log("First version: " + version)

    const boxV2 = await deployments.get("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgradeAndCall(
        transparentProxy.address,
        boxV2.address,
        "0x",
    )
    await upgradeTx.wait(1)
    const proxyBox = await ethers.getContractAt(
        "BoxV2",
        transparentProxy.address,
    )
    const versionV2 = await proxyBox.version()
    console.log("Nex version: " + versionV2)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
