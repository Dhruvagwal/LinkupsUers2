import axios from 'axios'
 
const NGROK = "http://4f52e3ce3b2b.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

