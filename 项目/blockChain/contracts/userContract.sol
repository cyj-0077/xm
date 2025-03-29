// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract UserContract {
    struct User {
        string id;
        string identify; // 身份证明，例如身份证号
        string passwordHash;
        string privateKey;
    }

    struct Message {
        string messageId;
        string senderId;
    }
    mapping(string => User) private users;
    mapping(string => Message[]) private messagesByReceiver;
    mapping(string => bool) private teacherIds;
    mapping(string => bool) private studentIds;
    mapping(string => string) private IdToOut;
    mapping(string => string) private outToId;

    event RegisterUser(string userId);
    event LoginUser(string userId);
    event LogoutUser(string userId);
    event ReceiveMessage(string messageId, string senderId, string receiverId);
    event IdToRole(string userId, string role);
    event SetOutId(string userId, string userOutId);
    event SetUserId(string userOutId, string userId);
    event PasswordReset(string userId);

    function idToRole(
        string memory id, 
        string memory role,
        string memory identify) public {
        //检查用户是否已存在
        if (isValidUser(id)) {
            revert("1");
        }
        //检查管理员添加的对应角色身份
        if (keccak256(bytes(role)) == keccak256(bytes("teacher"))) {
            teacherIds[id] = true;
        } else if (keccak256(bytes(role)) == keccak256(bytes("student"))) {
            studentIds[id] = true;
        } else {
            revert("4");
        }
        users[id] = User(id, identify, "", "");
        emit IdToRole(id, role);
    }//错误代码 4 角色错误;1 用户已存在
    function setOutId(string memory outId, string memory id) public {
        IdToOut[id] = outId;
        emit SetOutId(outId, id);
    }
    function getOutId(string memory id) public view returns (string memory) {
        return IdToOut[id];
    }
    function setUserId(string memory id, string memory outId) public {
        outToId[outId] = id;
        emit SetUserId(outId, id);
    }
    function getUserId(string memory outId) public view returns (string memory) {
        return outToId[outId];
    }
    function registerUser(
        string memory id, 
        string memory password, 
        string memory privateKey) public {
        if (bytes(users[id].passwordHash).length != 0) {
            revert("1"); // 用户已存在
        }
        if (!isValidUser(id)) {
            revert("2"); // 用户不存在
        }
        
        users[id] = User(id,users[id].identify, password, privateKey);

        emit RegisterUser(id);
    }//错误代码 1 用户已存在;2 用户不存在

    function loginUser(
        string memory id, 
        string memory password) public returns (bool) {
        if(bytes(users[id].passwordHash).length == 0){
            revert("5");
        }else if(keccak256(bytes(users[id].passwordHash)) != keccak256(bytes(password))){
            revert("3");
        }

        emit LoginUser(id);
        return true;
    }//错误代码 5 用户未注册;3 密码错误
    function logoutUser(string memory id) public {
        emit LogoutUser(id);
    }//用户登出或关闭页面

    function receiveMessage(
        string memory messageId, 
        string memory senderId, 
        string memory receiverId) public {
        Message memory newMessage = Message(messageId, senderId);
        messagesByReceiver[receiverId].push(newMessage);

        emit ReceiveMessage(messageId, senderId, receiverId);
    }//接收信息并存储

    function getMessagesByReceiver(string memory receiverId) public view returns (
        string[] memory,
        string[] memory) {
        uint messageCount = messagesByReceiver[receiverId].length;
        string[] memory messageIds = new string[](messageCount);
        string[] memory senderIds = new string[](messageCount);

        for (uint i = 0; i < messageCount; i++) {
            messageIds[i] = messagesByReceiver[receiverId][i].messageId;
            senderIds[i] = messagesByReceiver[receiverId][i].senderId;
        }

        return (messageIds, senderIds);
    }//获取信息

    function isValidUser(string memory id) public view returns (bool) {
        return teacherIds[id] || studentIds[id];
    }//验证用户是否存在
    function getUserRole(string memory id) public view returns (string memory role) {
        if (teacherIds[id]) {
            role = "teacher";
        } else if (studentIds[id]) {
            role = "student";
        }
    }//获取用户角色
    function resetPassword(string memory id, string memory privateKey, string memory newPasswordHash) public {
        if (bytes(users[id].id).length == 0) {
            revert("2"); // 用户不存在
        }
        if (keccak256(bytes(users[id].privateKey)) != keccak256(bytes(privateKey))) {
            revert("4"); // 私钥错误
        }

        // 更新密码哈希
        users[id].passwordHash = newPasswordHash;

        emit PasswordReset(id);
    }//重置密码 错误代码2 用户不存在;4 私钥错误

    // 其他用户功能可以在这里添加
}