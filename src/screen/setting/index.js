import React from 'react'
import { StyleSheet, View, Dimensions, Pressable } from 'react-native'

import {AuthConsumer} from 'context/auth'

import {Logout} from 'hooks/useAuth'
 
import {Text} from 'styles'
import color from 'colors'

const HEIGHT =Dimensions.get('screen').height
const WIDTH =Dimensions.get('screen').width

const Index = () => {
    const {setAuth} = AuthConsumer()
    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }
    return (
        <View style={{flex:1}}>
            <Pressable onPress={LOGOUT} style={styles.Logout}>
                <Text>LOG OUT</Text>
            </Pressable>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    Logout:{
        position:'absolute',
        bottom:0,
        backgroundColor: color.red,
        alignSelf:'center',
        width:'90%',
        padding:10,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    }
})
