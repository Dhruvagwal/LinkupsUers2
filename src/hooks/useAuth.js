import instances from '../data/axios'

import { AsyncStorage } from 'react-native'

const STORAGE_KEY_1 = 'LINKUPS_USER_ACCESS_TOKEN' 
const STORAGE_KEY_2 = 'LINKUPS_USER_REFRESH_TOKEN' 
const STORAGE_KEY_3 = 'LINKUPS_USER_PHONE_NUMBER' 

const signInWithPhoneNumber = async (phone)=>{

    const CODE = '+91'

    const otpData = {
      phone : '91'+phone,
      countryCode: CODE
    }

    const result = await instances.post('/requestOneTimePassword', otpData).then(()=>true).catch(()=>false)

    return result
}

const confirmOTP = async (phone, code)=>{
  const CODE = "91"

  const data = {
    phone: CODE + phone,
    code
  }
  const result = await instances.post('/verifyOneTimePassword', data).then(async (response)=>{

    await AsyncStorage.setItem(STORAGE_KEY_2, response.data.REFRESH_TOKEN)
    await AsyncStorage.setItem(STORAGE_KEY_1, response.data.ACCESS_TOKEN)
    await AsyncStorage.setItem(STORAGE_KEY_3, CODE+phone)

    return true
  }).catch((err)=>{
    console.log(err)
    return false
  })

  return result
}

const signUpWithPhoneNumber = async (phone)=>{

    const CODE = "+91"

    const data = {
      phone: CODE + phone
    }

    const otpData = {
      phone : '91'+phone,
      countryCode: CODE
    }
    
    const result = await instances.post('/createUsers', data).then(()=>true).catch(()=>false)
    result && await instances.post('/requestOneTimePassword', otpData)

    return result
  
}

const verifyToken = async ()=>{
  const LINKUPS_USER_REFRESH_TOKEN = await AsyncStorage.getItem(STORAGE_KEY_2)
  const LINKUPS_USER_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)

  const data={
    phone : LINKUPS_USER_PHONE_NUMBER,
    token : LINKUPS_USER_REFRESH_TOKEN
  }

  const result = await instances.post('/verifyToken', data).then(async (response)=>{
    await AsyncStorage.setItem(STORAGE_KEY_1, response.data.ACCESS_TOKEN)
    return true
  }).catch(err=>false)
  return result
}

const Logout =async()=>{
  await AsyncStorage.clear()
}

const createUser = async (phone, name)=>{
  return await instances.post('/DBcreate/api/account/create',{
    id:'91'+phone,
    AccountHolderName: name,
    isSeller: true,
    createdOn: new Date()
  }).then(()=>true).catch(()=>false)
}

export {signInWithPhoneNumber, signUpWithPhoneNumber, confirmOTP, verifyToken, Logout, createUser}