import React, {useState} from 'react'
import { Dimensions, Pressable, StyleSheet, View, Modal, StatusBar, TextInput} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import {signInWithPhoneNumber, confirmOTP} from 'hooks/useAuth'
import {AuthConsumer} from 'context/auth'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

const OTPScreen = ({setOTP, otp})=>{
    const [time, setTime] = useState(60)
    setTimeout(()=>{time>0 && setTime(time-1)},1000)
    return <>
        <Text size={20} style={{marginBottom:10}} regular>OTP</Text>
        <TextInput
            style={styles.TextInput}
            placeholder='Enter OTP'
            placeholderTextColor={color.inActive}
            onChangeText={setOTP}
            keyboardType='number-pad'
        />
        <RowView style={{justifyContent:'space-between'}}>
            <Text size={12}>00:{time}</Text>
            <Pressable onPress={()=>{time0===0 && setTime(60)}}>
                <Text size={12} style={{margin:5}}>Resend OTP</Text>
            </Pressable>
        </RowView>
    </>
}

const Login = () => {
    const [login, setLogin] = useState(true)
    const [phone, setPhone] = useState('')
    const [OTP, setOTP] = useState(false)
    const {setAuth} = AuthConsumer()
    const pressChange = ()=>{
        setLogin(!login)
    }
    const auth =async ()=>{
        if(!OTP){
            phone.length === 10 ? setOTP(true) : alert('Please Enter Correct Number')
            await signInWithPhoneNumber(phone)
                .then(response=>setLogin(response))
                .catch(err=>setLogin(false))
        }else{
            const result = await confirmOTP(phone, OTP)
            result?setAuth(true):setOTP(false)  
        }
    }

    return (
        <Modal transparent>
            <StatusBar translucent backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}}>
                <View style={styles.LoginContainer}>
                    <View style={{padding:20}}>
                        {
                           !OTP? 
                            <>
                                <Text size={20} style={{marginBottom:10}} regular>Login</Text>
                                <TextInput
                                    placeholder='Phone Number'
                                    style={styles.TextInput}
                                    placeholderTextColor={color.inActive}
                                    keyboardType='number-pad'
                                    onChangeText={setPhone}
                                    value={phone}
                                />
                                <Pressable onPress={pressChange}>
                                    <Text regular style={{color:color.active, alignSelf: 'flex-end',marginTop:10}} size={12}>
                                        {!login?'Have An Account? Login':'Create Account'}
                                    </Text>
                                </Pressable>
                            </>
                            :
                            <OTPScreen setOTP={setOTP}/>
                        }
                    </View>

                    <Pressable onPress = {auth} style={{backgroundColor:color.blue, height:70, justifyContent:'center', alignItems:'center', position:'absolute', bottom:0, width:WIDTH}}>
                        <RowView>
                            <AntDesign name="login" size={24} color={color.white} />
                            <Text regular> {!login?'Create':'Login'}</Text>
                        </RowView>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default Login

const styles = StyleSheet.create({
    LoginContainer:{
        position:'absolute',
        bottom:0,
        backgroundColor:color.lightDark,
        width:WIDTH,
        height:HEIGHT*.32,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
    },
    TextInput:{
        paddingVertical: 10,
        fontSize:20,
        letterSpacing:2,
        color:color.white,
        fontFamily:'Montserrat-Regular',
        borderBottomWidth:4,
        borderBottomColor:color.active,
    }
})
