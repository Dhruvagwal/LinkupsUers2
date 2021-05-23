import axios from 'axios'
 
const NGROK = "http://66ddb6cd73b9.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

