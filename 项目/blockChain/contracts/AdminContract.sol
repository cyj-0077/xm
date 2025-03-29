// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract AdminContract {
    mapping(string => string) public adminIdToPassword;

    event AdminRegister(string indexed adminId);
    event AdminLogin(string indexed adminId);
    event AdminLogout(string indexed adminId);

    function registerAdmin(string memory adminId, string memory password) public {
        if (bytes(adminIdToPassword[adminId]).length != 0) {
            revert("adminId already exists");
        }

        adminIdToPassword[adminId] = password;

        emit AdminRegister(adminId);
    }

    function loginAdmin(string memory adminId, string memory password) public returns (bool) {
        if(bytes(adminIdToPassword[adminId]).length == 0){
            revert("adminId not found");
        }
        if(keccak256(bytes(adminIdToPassword[adminId])) != keccak256(bytes(password))){
            revert("password error");
        }

        emit AdminLogin(adminId);
        return true;
    }

    function logoutAdmin(string memory adminId) public {
        emit AdminLogout(adminId);
    }

    // 其他管理员功能可以在这里添加
} 