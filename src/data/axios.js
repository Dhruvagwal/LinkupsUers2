import axios from 'axios'
 
const NGROK = "http://92bc48598e3c.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

