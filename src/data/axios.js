import axios from 'axios'
 
const NGROK = "http://41476c3d5d1d.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

