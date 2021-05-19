import axios from 'axios'
 
const NGROK = "http://b388cfc1c572.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

