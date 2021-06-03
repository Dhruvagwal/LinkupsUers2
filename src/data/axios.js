import axios from 'axios'
 
const NGROK = "http://6c65b53a1003.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

