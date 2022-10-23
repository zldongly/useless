# 新增项目步骤

[官方文档](https://v2-docs.zksync.io/dev/developer-guides/hello-world.html)

## 初始化项目

```shell
mkdir greeter-example 
cd greeter-example
yarn init -y
# 加依赖
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
yarn add -D @openzeppelin/contracts
```

## 添加配置文件

`./hardhat.config.ts`

## 新建文件夹

`./contracts/`  
`./deploy/`

## 编写sol

`./contracts/Greeter.sol`

## 编译

```shell
yarn hardhat compile
```

* 编译文件夹    
  `./artifacts-zk/`  
  `./cache-zk/`

## 添加部署脚本

`./deploy/deploy.ts`

* 修改部署脚本
    * 替换私钥
    * 更换合约名称，构造函数参数

## 部署

```shell
yarn hardhat deploy-zksync
```

# contract
0xd750761c20989203b811863d9ef68cb2c7b2826c


```shell
git remote add origin git@github.com:zldongly/useless.git
git branch -M main
git push -u origin main

```