import axios from 'axios'
 
const NGROK = "http://a65dbb8e2b34.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

