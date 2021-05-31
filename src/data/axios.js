import axios from 'axios'
 
const NGROK = "http://8d0f10cab112.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

