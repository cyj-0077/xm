import Web3 from 'web3';
import { ethers } from 'ethers';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import AdminContractJSON from '../build/contracts/AdminContract.json';
import keys from '../ganache-cli/ganache-keys.json';// 读取私钥文件

// 创建Web3实例
let web3 = null;
let adminContractAddress = null;
let adminContract =null;
let account = null;

async function getWeb3(){
        web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

        adminContractAddress = AdminContractJSON.networks[5777].address;
        account = web3.eth.accounts.privateKeyToAccount(keys[0].privateKey);
        adminContract = await new web3.eth.Contract(AdminContractJSON.abi,adminContractAddress);
}   

async function sendTx(method){
    await getWeb3();
    //动态获取gas
    const gas = await method.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();
    const tx = {
        from: account.address,
        to: adminContractAddress,
        data: method.encodeABI(),
        gas: gas,
        gasPrice: gasPrice
    }
    const txHash = await method.send(tx);
    return txHash;
}

export async function preCheckRegisterAdmin(adminId, password) {
    // 创建 JsonRpcProvider 实例
    const provider = new JsonRpcProvider('http://127.0.0.1:7545');

    //创建钱包实例
    account = new Wallet(keys[0].privateKey, provider);
    
    // 获取合约地址
    adminContractAddress = AdminContractJSON.networks[5777].address;
    
    // 创建合约实例
    adminContract = new Contract(adminContractAddress, AdminContractJSON.abi, account);
    try {
        // 使用静态调用来检查交易是否会成功
        const result = await adminContract.registerAdmin.staticCall(adminId, password);
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error.reason };
    }
}

export async function registerAdmin(adminId, password) {
    await getWeb3();
    try {
        const method = adminContract.methods.registerAdmin(adminId, password);
        const txHash = await sendTx(method);
        return { success: true, txHash };
    } catch (error) {   
        return { success: false, reason: error };
    }
}

export async function preCheckLoginAdmin(adminId, password) {
    // 创建 JsonRpcProvider 实例
    const provider = new JsonRpcProvider('http://127.0.0.1:7545');

    //创建钱包实例
    account = new Wallet(keys[0].privateKey, provider);
    
    // 获取合约地址
    adminContractAddress = AdminContractJSON.networks[5777].address;
    
    // 创建合约实例
    adminContract = new Contract(adminContractAddress, AdminContractJSON.abi, account);
    try {
        // 使用静态调用来检查交易是否会成功
        const result = await adminContract.loginAdmin.staticCall(adminId, password);
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error.reason };
    }
}

export async function loginAdmin(adminId, password) {
    await getWeb3();
    try {
        const method = adminContract.methods.loginAdmin(adminId, password);
        const txHash = await sendTx(method);
        return { success: true, txHash };
    } catch (error) {
        return { success: false, reason: error };
    }
}

export async function logoutAdmin(adminId) {
    try {
        await getWeb3();
        const method = adminContract.methods.logoutAdmin(adminId);
        const txHash = await sendTransaction(method);
        console.log('管理员登出成功:', txHash);
        return txHash;
    } catch (error) {
        console.error('管理员登出失败:', error);
    }
}