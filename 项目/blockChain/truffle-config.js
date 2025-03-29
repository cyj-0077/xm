/**
 * Truffle 配置文件
 */
module.exports = {
  // 配置网络
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Ganache GUI 默认端口
      network_id: "*",       // Any network (default: none)
    },
  },

  // 配置编译器
  compilers: {
    solc: {
      version: "0.8.8",      // 使用的 solidity 版本
      settings: {
        optimizer: {
          enabled: true,     // 启用优化器
          runs: 200          // 优化运行次数
        }
      }
    }
  },
}; 