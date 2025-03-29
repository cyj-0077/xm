process.env.NODE_NO_WARNINGS = '1';

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';

const execAsync = util.promisify(exec);

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义密钥文件路径
const keysFilePath = path.join(__dirname, 'ganache-keys.json');
const dbPath = path.join(__dirname, './db');

// 获取 ganache-cli 的路径
const ganacheCliPath = path.join(__dirname, 'node_modules', '.bin', 'ganache-cli');


// 确保数据库目录存在
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
}

// 检查合约是否需要重新编译
const needsRecompile = async () => {
    const buildDir = path.join(__dirname, '..', 'build', 'contracts');
    if (!fs.existsSync(buildDir)) {
        return true;
    }
    const sourceDir = path.join(__dirname, '..', 'contracts');
    const sourceFiles = fs.readdirSync(sourceDir).map(file => path.join(sourceDir, file));
    const buildFiles = fs.readdirSync(buildDir).map(file => path.join(buildDir, file));

    const sourceModified = sourceFiles.some(sourceFile => {
        const sourceStat = fs.statSync(sourceFile);
        return buildFiles.every(buildFile => {
            const buildStat = fs.statSync(buildFile);
            return sourceStat.mtime > buildStat.mtime;
        });
    });

    return sourceModified;
};

// 编译合约
const compileContracts = async () => {
    if (await needsRecompile()) {
        try {
            console.log('编译合约...');
            await execAsync(`${path.join(__dirname, 'node_modules/.bin/truffle')} compile`, { cwd: path.join(__dirname, '..') });
            console.log('合约编译成功');
        } catch (error) {
            console.error('合约编译失败:', error);
            throw error;
        }
    } else {
        console.log('合约已是最新，无需重新编译');
    }
};

// 检查是否需要迁移合约
const needsMigration = async () => {
    const buildDir = path.join(__dirname, '..', 'build', 'contracts');
    if (!fs.existsSync(buildDir)) {
        return true; // 如果构建目录不存在，说明需要迁移
    }

    const buildFiles = fs.readdirSync(buildDir).map(file => path.join(buildDir, file));

    const needsMigration = buildFiles.some(buildFile => {
        const contractData = JSON.parse(fs.readFileSync(buildFile, 'utf8'));
        // 检查 networks 字段是否为空对象
        return !contractData.networks || Object.keys(contractData.networks).length === 0;
    });

    return needsMigration;
};

// 迁移合约
const migrateContracts = async () => {
    if (await needsMigration()) {
        try {
            console.log('迁移合约...');
            await execAsync(`${path.join(__dirname, 'node_modules/.bin/truffle')} migrate`, { cwd: path.join(__dirname, '..') });
            console.log('合约迁移成功');
        } catch (error) {
            console.error('合约迁移失败:', error);
            throw error;
        }
    } else {
        console.log('合约已是最新，无需重新迁移');
    }
};

// 启动Ganache CLI并返回Promise
const startGanache = async () => {
    const ganacheProcess = exec(`${ganacheCliPath} -p 7545 --db ${dbPath} -d --networkId 5777`);

    let outputData = '';
    let resolved = false;

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            if (!resolved) {
                reject(new Error('启动Ganache CLI超时'));
            }
        }, 30000); // 增加超时时间到30秒

        ganacheProcess.stdout.on('data', (data) => {
            console.log(`Ganache CLI 输出: ${data}`);
            outputData += data;

            // 检查是否包含"Listening on"以确认启动成功
            if (outputData.includes('Listening on') && !resolved) {
                resolved = true;
                clearTimeout(timeout);

                const privateKeyRegex = /Private Keys\n==================\n((?:\(\d+\) 0x[a-fA-F0-9]{64}\n)+)/;
                const match = privateKeyRegex.exec(outputData);

                if (match) {
                    const keys = match[1].trim().split('\n').map(line => {
                        const [index, privateKey] = line.split(' ');
                        return { index, privateKey };
                    });

                    fs.writeFile(keysFilePath, JSON.stringify(keys, null, 2), (err) => {
                        if (err) {
                            console.error('写入密钥文件失败:', err);
                            return;
                        }
                        console.log(`密钥已保存到 ${keysFilePath}`);
                    });
                }
                resolve();
            }
        });

        ganacheProcess.on('exit', (code) => {
            if (!resolved) {
                clearTimeout(timeout);
                if (code !== 0) {
                    reject(new Error(`Ganache CLI 进程以非零状态码退出: ${code}`));
                } else {
                    resolve();
                }
            }
        });
    });
};

// 主函数
(async () => {
    try {
        await compileContracts(); // 先编译合约
        console.log('启动Ganache CLI...');
        await startGanache(); // 然后启动Ganache
        setTimeout(async () => {
            try {
                await migrateContracts(); // 迁移合约
            } catch (error) {
                console.error('合约迁移失败:', error);
            }
        }, 2000);
    } catch (error) {
        console.error('启动或操作失败:', error);
    }
})();