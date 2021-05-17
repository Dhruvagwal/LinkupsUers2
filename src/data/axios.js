import axios from 'axios'
 
const NGROK = "http://a4c1271bbd83.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

