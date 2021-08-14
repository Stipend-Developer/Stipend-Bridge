//web3 modules
const Web3 = require('web3');

//general purpose npm moudles
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const solc = require('solc');
const spdBalance = require('crypto-balances');

process.on('unhandledRejection', console.error.bind(console))

//contract sources
const controllerContractPath = path.join(__dirname, "./../contracts/controller/")
const factoryContractPath = path.join(__dirname, "./../contracts/factory/")
const tokenContractPath = path.join(__dirname, "./../contracts/token/")
const utilsContractPath = path.join(__dirname, "./../contracts/utils/")

const compilationInput = {
    "OwnableContract.sol" : fs.readFileSync(utilsContractPath + 'OwnableContract.sol', 'ascii'),
    "OwnableContractOwner.sol" : fs.readFileSync(utilsContractPath + 'OwnableContractOwner.sol', 'ascii'),
    "IndexedMapping.sol" : fs.readFileSync(utilsContractPath + 'IndexedMapping.sol', 'ascii'),
    "Controller.sol" : fs.readFileSync(controllerContractPath + 'Controller.sol', 'ascii'),
    "ControllerInterface.sol" : fs.readFileSync(controllerContractPath + 'ControllerInterface.sol', 'ascii'),
    "Factory.sol" : fs.readFileSync(factoryContractPath + 'Factory.sol', 'ascii'),
    "Members.sol" : fs.readFileSync(factoryContractPath + 'Members.sol', 'ascii'),
    "MembersInterface.sol" : fs.readFileSync(factoryContractPath + 'MembersInterface.sol', 'ascii'),
    "WSPD.sol" : fs.readFileSync(tokenContractPath + 'WSPD.sol', 'ascii')
};

function findImports (_path) {
    if(_path.includes("openzeppelin-solidity"))
        return { contents: fs.readFileSync(path.join(__dirname, "./../node_modules/" + _path), 'ascii') }
    else
        return { contents: fs.readFileSync(path.join(__dirname, "./../contracts/" + _path), 'ascii') }
}

const mainnetUrls = [];


const wspdAddress = "";

checkAll();

async function checkAll() {
  await(check(mainnetUrls[0]));
  await(check(mainnetUrls[1]));
}


async function check(mainnetUrl) {
    console.log("wspd address", wspdAddress);
    console.log("web3 url", mainnetUrl);

    let wspdTotalSupply = 0;
    let spdTotalInventory = 0;

    web3 = new Web3(new Web3.providers.HttpProvider(mainnetUrl));
    /////////////////////////////////////////////////////////////
    console.log("starting compilation");
    const solcOutput = await solc.compile({ sources: compilationInput }, 1, findImports);
    if(solcOutput.errors == undefined) console.log("no complication errors");
    else console.log(solcOutput.errors);
    console.log("finished compilation");

    const wspdContract = await getContractAndCompareCode("WSPD", wspdAddress, solcOutput);
    const totalSupply = await wspdContract.methods.totalSupply().call();
    console.log("totalSupply", totalSupply.toString());

    wspdTotalSupply = parseFloat(totalSupply) / (10**8);

    const controllerAddress = await wspdContract.methods.owner().call();
    console.log("Controller", controllerAddress);
    const controllerContract = await getContractAndCompareCode("Controller",controllerAddress,solcOutput);
    console.log("Controller owner", await controllerContract.methods.owner().call());

    const membersAddress = await controllerContract.methods.members().call();
    console.log("Members", membersAddress);
    const membersContract = await getContractAndCompareCode("Members",membersAddress,solcOutput);
    console.log("members owner", await membersContract.methods.owner().call());
    const merchants = await membersContract.methods.getMerchants().call();
    console.log("merchants", merchants);
    const custodian = await membersContract.methods.custodian().call();
    console.log("custodian", custodian);

    const factoryAddress = await controllerContract.methods.factory().call();
    console.log("Factory address", factoryAddress);
    const factoryContract = await getContractAndCompareCode("Factory",factoryAddress,solcOutput);
    for(let i = 0 ; i < merchants.length; i++) {
      const merchantDepostAddress = await factoryContract.methods.merchantSpdDepositAddress(merchants[i]).call();
      if(merchantDepostAddress == "") console.log("warning: merchant", merchants[i],"deposit address undefined!!!");
      else console.log("merchant", merchants[i],"deposit address",merchantDepostAddress);

      const custodianDepositAddress = await factoryContract.methods.custodianSpdDepositAddress(merchants[i]).call();
      if(custodianDepositAddress == "") console.log("warning: merchant", merchants[i],"custodian deposit address undefined!!!");
      else {
        console.log("merchant", merchants[i],"custodian deposit address",custodianDepositAddress);
        const balanceResult = await spdBalance(custodianDepositAddress);
        const balanceQty = parseFloat(balanceResult[0]["quantity"]);
        spdTotalInventory += balanceQty;
      }
    }

    console.log("SPD in custoday", spdTotalInventory);
    console.log("WSPD total supply", wspdTotalSupply);
    if(spdTotalInventory >= wspdTotalSupply) console.log("SPD in custody >= WSPD total supply, ok");
    else console.log("error: SPD in custody < WSPD total supply");

    console.log("\n\n\n");
}


async function getContractAndCompareCode(contractName, address, solcOutput){
  const abi = solcOutput.contracts[contractName + ".sol:" + contractName].interface;
  const contract = await new web3.eth.Contract(JSON.parse(abi), address);
  const contractSolcCode = '0x' + (solcOutput.contracts[contractName + ".sol:" + contractName].runtimeBytecode);
  const contractDeployedCode = await web3.eth.getCode(address);

  if(contractSolcCode != contractDeployedCode){
    console.log(contractName, "code missmach");
    return null;
  }

  console.log(contractName, "code ok");
  return contract;
}
