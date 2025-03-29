import axios from 'axios'
import dayjs from 'dayjs'
// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000
})


// 获取学生和教师数量
export async function getCounts() {
    return request.get('/getCounts')
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}
// 管理员注册用户
export async function registerUser(userData) {
    return request.post('/register', userData)
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}
// 获取学生信息
export async function getStudents() {
    return request.get('/getStudents')
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}   
// 获取教师信息
export async function getTeachers() {
    return request.get('/getTeachers')
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}

// 获取所有用户信息（学生和教师）
export async function getAllUsers() {
    try {
        const [students, teachers] = await Promise.all([
            getStudents(),
            getTeachers()
        ])
        return { students, teachers }
    } catch (error) {
        throw error
    }
}

// 获取单个用户信息
export async function getSingleUser(id, role) {
    return request.get('/getSingleUser', { params: { id:id, role:role } })
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error
        })
}

//私钥种子传递给后端获取私钥
export async function getPrivateKey(seed) {
    return request.post('/getPrivateKey', { seed })
        .then(response => {
            return response.data
        })
}

// 发送留言函数
export async function sendMessage(senderName, messageContent, receiverName) {
    try {
        const response = await request.post('/sendMessage', {
            senderName,
            messageContent,
            receiverName
        });

        // 返回后端返回的 senderId
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 获取用户留言
export async function getMessagesByMessageId(messageId) {
    return request.get('/getMessagesByMessageId', { params: { messageId } })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}

// 设置留言已读
export async function setMessageRead(messageId, isRead) {
    return request.post('/setMessageRead', { messageId:parseInt(messageId), isRead:isRead })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}

// 游客注册
export async function registerVisitor(visitorData) {
    return request.post('/registerVisitor', visitorData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
}


//游客登录
export async function loginVisitor(visitorData) {
    return request.post('/loginVisitor', visitorData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
}           

//游客预约
export async function reserveVisitor(visitorData) {
    return request.post('/reserveVisitor', visitorData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
}