import Web3 from 'web3'
import { HDNodeWallet } from 'ethers'
// 根据用户ID和密码生成密钥
export async function generateKey(id, password) {
    const combined = id + password
    const mid = Math.floor(password.length / 2)
    const salt = password.slice(mid, mid + 1)
    
    const web3 = new Web3()
    const hash = web3.utils.sha3(combined + salt)
    const seed = hash.padEnd(64, '0')
    const wallet = HDNodeWallet.fromSeed(seed)
    return {hashPassword:hash,privateKey:wallet.privateKey}
}
