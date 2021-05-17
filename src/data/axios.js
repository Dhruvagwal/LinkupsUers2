import axios from 'axios'
 
const NGROK = "http://d09ac637216e.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

