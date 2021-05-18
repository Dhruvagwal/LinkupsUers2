import axios from 'axios'
 
const NGROK = "http://411ed334574d.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

