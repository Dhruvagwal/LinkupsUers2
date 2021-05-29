import React from 'react'
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, FontAwesome, Foundation, Feather } from '@expo/vector-icons'; 
import { StyleSheet, View, Dimensions, Pressable, Image } from 'react-native'

import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'

import {Logout} from 'hooks/useAuth'
 
import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT =Dimensions.get('screen').height
const WIDTH =Dimensions.get('screen').width

const BackGround = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}


const IMAGE_SIZE = 150

const Options=({children, onPress})=>{
    return <Pressable style={{padding:15}} android_ripple={{color:color.dark}} onPress={onPress}>
            <RowView style={{justifyContent:'space-between'}}>
                <RowView>
                    {children}
                </RowView>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={color.white} />
            </RowView>
        </Pressable>
    }
    
const Index = () => {
    const {setAuth} = AuthConsumer()
    const {state:{profile}} = DataConsumer()
    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }

    return (
        <View style={{flex:1}}>
            <BackGround/>
            <View style={{height:HEIGHT*.02}}/>
            <View style={{padding:20,flex:1}}>
                <RowView style={{justifyContent:'space-between', alignItems:'flex-start'}}>
                    <View>
                        <Text bold size={20}>Linkups</Text>
                        <Text size={13}>Profile</Text>
                    </View>
                </RowView>
                <View style={{alignItems:'center', alignSelf:'center'}}>
                    <Image source={{uri:profile.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:IMAGE_SIZE}}/>
                    <Pressable style={styles.camera}>
                        <Feather name="camera" size={24} color={color.white} />
                    </Pressable>
                </View>
                <View style={{flex:.85, marginTop:20}}>
                    <Text size={20} style={{alignSelf:'center'}} bold>{profile.name}</Text>
                    <Text style={{alignSelf:'center'}} regular>+91 {profile.id.replace('91','')}</Text>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Options>
                            <FontAwesome name="address-book" size={24} color={color.white} />
                            <Text>  My Address</Text>
                        </Options>
                        <Options>
                            <AntDesign name="customerservice" size={24} color={color.white} />
                            <Text>  Become a Seller</Text>
                        </Options>
                        <Options>
                            <Entypo name="language" size={24} color={color.white} />
                            <Text>  Language</Text>
                        </Options>
                        <Options>
                            <Entypo name="help" size={24} color={color.white} />
                            <Text>  Help & Support</Text>
                        </Options>
                        <Options>
                            <Foundation name="info" size={24} color={color.white} style={{marginLeft:5}} />
                            <Text>   About Us</Text>
                        </Options>
                    </View>
                </View>
            </View>
            <Pressable onPress={LOGOUT} style={styles.Logout}>
                <Text bold>LOGOUT</Text>
            </Pressable>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    Logout:{
        position:'absolute',
        bottom:10,
        backgroundColor: color.red,
        alignSelf:'center',
        width:'90%',
        padding:10,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    camera:{
        backgroundColor: color.active,
        padding:10,
        position:'absolute',
        bottom:-10,
        right:10,
        borderRadius:100
    }
})
