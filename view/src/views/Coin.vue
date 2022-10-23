<template>
  <div>
    <h1>Coin</h1>
    <button @click="connectMetamask">Connect Metamask</button>

    <div>
      <span>{{ account }}</span>
    </div>
    <div>
      <span>{{ balance }} UC</span>
    </div>

    <div>
      <button @click="claim">Claim</button>
    </div>

  </div>
</template>

<script>
import {Contract, Provider, Web3Provider} from "zksync-web3";
import {ethers} from "ethers";

const COIN_CONTRACT_ADDRESS = '0xd750761c20989203b811863d9ef68cb2c7b2826c'
const COIN_CONTRACT_ABI = require("../assets/eth/coin_abi.json");

const ETH_L1_ADDRESS = "0x0000000000000000000000000000000000000000";
//const allowedTokens = require("./eth.json");

export default {
  name: "Coin",
  data() {
    return {
      account: '',
      provider: null,
      signer: null,
      contract: null,
      balance: '0',
    }
  },
  methods: {
    // 初始化 连接合约
    initializeProviderAndSigner() {
      this.provider = new Provider('https://zksync2-testnet.zksync.dev');
      // Note that we still need to get the Metamask signer
      let web3Provider = new Web3Provider(window.ethereum)
      // 连接合约
      this.signer = (web3Provider).getSigner();
      this.contract = new Contract(
          COIN_CONTRACT_ADDRESS,
          COIN_CONTRACT_ABI,
          this.signer
      );
    },
    loadMainScreen() {
      // 当前钱包地址
      //window.
      // 连接合约
      this.initializeProviderAndSigner();

      if (!this.provider || !this.signer) {
        alert("Follow the tutorial to learn how to connect to Metamask!");
        return;
      }
    },
    // 连接钱包
    connectMetamask() {
      if (!window.ethereum) {
        alert("未检查到Metamask")
        return
      }
      window.ethereum.request({method: 'eth_requestAccounts'})
          .then((accounts) => {
            this.account = accounts[0]
            if (+window.ethereum.networkVersion === 280) {
              //this.loadMainScreen()
              console.log(window.ethereum.networkVersion)
              this.loadMainScreen()
              this.getBalanceOf().then((bal) => {
                this.balance = bal
              })
              //console.log(this.balance)
            } else {
              alert("Please switch network to zkSync!")
            }
          })
          .catch((e) => console.log(e));

    },

    // 当前用户coin金额
    async getBalanceOf() {
      let decimal = await this.contract.decimals()
      //console.log("decimals", decimal)
      let balanceInUnits = await this.contract.balanceOf(this.account);
      //console.log(balanceInUnits)
      return ethers.utils.formatUnits(balanceInUnits, decimal)
    },

    // claim
    async claim() {
      try {
        // const txHandle = await this.contract.setGreeting(this.newGreeting, await this.getOverrides());
        const txHandle = await this.contract.claim(null);
        txHandle.wait();

        this.balance = await this.getBalanceOf()
      } catch (e) {
        alert(JSON.stringify(e));
      }
    },
    async claimFee() {
      const feeInGas = await this.contract.estimateGas.claim()
      const gasPriceInUnits = await this.provider.getGasPrice();
      return ethers.utils.formatUnits(feeInGas.mul(gasPriceInUnits), 18);
    },
  },
}
</script>

<style scoped>

</style>