import Web3 from 'web3';
import { ethers } from 'ethers';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import UserContractJSON from '../build/contracts/UserContract.json';
import keys from '../ganache-cli/ganache-keys.json';

// 创建Web3实例
let web3 = null;
let userContractAddress = null;
let userContract = null;
let account = null;

//获取web3实例
async function getWeb3() {
    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

    userContractAddress = UserContractJSON.networks[5777].address;
    account = web3.eth.accounts.privateKeyToAccount(keys[0].privateKey);
    userContract = await new web3.eth.Contract(UserContractJSON.abi, userContractAddress);
}

//预检查
async function precheck(method, ...args) {
    // 创建 JsonRpcProvider 实例
    const provider = new JsonRpcProvider('http://127.0.0.1:7545');

    //创建钱包实例
    account = new Wallet(keys[0].privateKey, provider);

    // 获取合约地址
    userContractAddress = UserContractJSON.networks[5777].address;

    // 创建合约实例
    userContract = new Contract(userContractAddress, UserContractJSON.abi, account);
    try {
        // 使用静态调用来检查交易是否会成功
        const result = await userContract[method].staticCall(...args);
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error.reason };
    }
}

//发送交易(这个比较快)
async function sendTx(method) {
    await getWeb3();
    //动态获取gas
    const gas = await method.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();
    const tx = {
        from: account.address,
        to: userContractAddress,
        data: method.encodeABI(),
        gas: gas,
        gasPrice: gasPrice
    }
    const txHash = await method.send(tx);
    return txHash;
}

export async function idToRole(id, role, identify) {
    const result = await precheck('idToRole', id, role, identify);
    if (result.success) {
        try {
            await getWeb3();
            const method = userContract.methods.idToRole(id, role, identify);
            const txHash = await sendTx(method);
            return { success: true, txHash };
        } catch (error) {
            return { success: false, reason: error };
        }
    } else {
        return { success: false, reason: result.reason };
    }
}

export async function setOutId(outId, id) {
    try {
        await getWeb3();
        const method = userContract.methods.setOutId(outId, id);
        const txHash = await sendTx(method);
        return { success: true, txHash };
    } catch (error) {
        return { success: false, reason: error };
    }
}

export async function getOutId(id) {
    try {
        await getWeb3();
        const method = userContract.methods.getOutId(id);
        const result = await method.call(); 
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error };
    }
}

export async function setUserId(id, outId) {
    try {
        await getWeb3();
        const method = userContract.methods.setUserId(id, outId);
        const txHash = await sendTx(method);    
        return { success: true, txHash };
    } catch (error) {
        return { success: false, reason: error };
    }
}   

export async function getUserId(outId) {
    try {
        await getWeb3();
        const method = userContract.methods.getUserId(outId);
        const result = await method.call();
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error };
    }
}

export async function getUserRole(id) {
    try {
        await getWeb3();
        const method = userContract.methods.getUserRole(id);
        const result = await method.call();
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error };
    }
}


export async function registerUser(id, passwordHash, privateKey) {
    const result = await precheck('registerUser', id, passwordHash, privateKey);
    if (result.success) {
        try {
            await getWeb3();
            const method = userContract.methods.registerUser(id, passwordHash, privateKey);
            const txHash = await sendTx(method);
            return { success: true, txHash };
        } catch (error) {
            return { success: false, reason: error };
        }
    } else {
        return { success: false, reason: result.reason };
    }
}

export async function loginUser(id, passwordHash) {
    const result = await precheck('loginUser', id, passwordHash);
    if (result.success) {
        try {
            await getWeb3();
            const method = userContract.methods.loginUser(id, passwordHash);
            const txHash = await sendTx(method);
            return { success: true, txHash };
        } catch (error) {
            return { success: false, reason: error };
        }
    } else {
        return { success: false, reason: result.reason };
    }
}

export async function resetPassword(id, privateKey, newPasswordHash) {
    const result = await precheck('resetPassword', id, privateKey, newPasswordHash);
    if (result.success) {
        try {
            await getWeb3();
            const method = userContract.methods.resetPassword(id, privateKey, newPasswordHash);
            const txHash = await sendTx(method);
            return { success: true, txHash };
        } catch (error) {
            return { success: false, reason: error };
        }
    } else {
        return { success: false, reason: result.reason };
    }
}

export async function logoutUser(id) {
    try {
        const method = userContract.methods.logoutUser(id);
        const txHash = await sendTransaction(method);
        console.log('用户登出成功:', txHash);
        return txHash;
    } catch (error) {
        console.error('用户登出失败:', error);
    }
}

export async function receiveMessage(messageId, senderId, receiverId) {
    try {
        await getWeb3();
        const method = userContract.methods.receiveMessage(messageId, senderId, receiverId);
        const txHash = await sendTx(method);
        return { success: true, txHash };
    } catch (error) {
        return { success: false, reason: error };
    }
}

export async function getMessagesByReceiver(receiverId) {
    try {
        await getWeb3();
        const method = userContract.methods.getMessagesByReceiver(receiverId);
        const result = await method.call();
        return { success: true, result };
    } catch (error) {
        return { success: false, reason: error };
    }
}

