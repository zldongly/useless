import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the Useless contract`);

    // 环境变量 ETH_PRIV 中取私钥
    let  privKey = process.env.ETH_PRIV;
    if (!privKey.startsWith('0x')) {
        privKey = '0x'+privKey
    }

    // Initialize the wallet.
    const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
    const wallet = new Wallet(privKey);

    console.log("deployer address", wallet.address)
    // Create deployer object and load the artifact of the contract you want to deploy.
    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("UselessCoin"); // 合约名称

    // 合约构造函数
    // Estimate contract deployment fee
    //const greeting = "Hi there!";
    //const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting]);
    const deploymentFee = await deployer.estimateDeployFee(artifact,[]);
    console.log("estimate deploy fee", deploymentFee.toString())
    /*
       // Deposit funds to
       // 从主网转eth gas到zksync
         const depositHandle = await deployer.zkWallet.deposit({
           to: deployer.zkWallet.address,
           token: utils.ETH_ADDRESS,
           amount: deploymentFee.mul(2),
       });
       // Wait until the deposit is processed on zkSync
       await depositHandle.wait();
   */
    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    // 部署
    //const greeterContract = await deployer.deploy(artifact, [greeting]);
    const uselessCoinContract = await deployer.deploy(artifact);

    //obtain the Constructor Arguments
    // 构造函数参数
    //console.log("constructor args:" + greeterContract.interface.encodeDeploy([greeting]));

    // Show the contract info.
    const contractAddress = uselessCoinContract.address;
    console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}