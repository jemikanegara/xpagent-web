import axios from 'axios'

const graphql = async (query, variables, upload) => {
    const options = {
        method: "post",
        url: process.env.VUE_APP_ENDPOINT,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': upload ? 'multipart/form-data; boundary=----WebKitFormBoundaryFueWzzKPgIeDGcAh' : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }
    return await axios({
        ...options,
        data: {
            query,
            variables
        }
    })
}

export default graphql