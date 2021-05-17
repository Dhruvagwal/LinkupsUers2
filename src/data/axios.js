import axios from 'axios'
 
const NGROK = "http://edacd21fbf43.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

