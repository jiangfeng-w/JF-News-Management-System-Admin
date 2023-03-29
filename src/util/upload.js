import axios from 'axios'

function upload(path, userForm) {
    // 生成formdata对象
    const params = new FormData()
    for (const i in userForm) {
        params.append(i, userForm[i])
    }
    // 发起请求
    return axios
        .post(path, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(res => res)
}
export default upload
