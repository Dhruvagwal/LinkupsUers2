import axios from 'axios'
 
const NGROK = "http://b585f9da3598.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

