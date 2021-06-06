import React,{useState, useEffect} from 'react'
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, FontAwesome, Foundation, Feather } from '@expo/vector-icons'; 
import { StyleSheet, View, Dimensions, Pressable, Image, Linking, BackHandler } from 'react-native'

import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'

import {Logout} from 'hooks/useAuth'
import {getDataById} from 'hooks/useData'
import CONSTANT from 'navigation/navigationConstant.json'
import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import BottomBar from 'components/BottomBar';
import ImageViewer from 'components/ImageViewer';
import ImagePicker from 'components/ImagePicker'

const HEIGHT =Dimensions.get('screen').height
const WIDTH =Dimensions.get('screen').width

const BackGround = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}


const IMAGE_SIZE = 150

const Options=({children})=>{
    return <RowView style={{justifyContent:'space-between'}}>
                <RowView>
                    {children}
                </RowView>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={color.white} />
            </RowView>
    }

    
    
const Index = ({navigation}) => {
    const {setAuth} = AuthConsumer()
    const {state:{profile}, Update} = DataConsumer()
    const [isSeller, setIsSeller] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        getDataById('serviceProvider',profile.id).then(({data})=>{
            data!==undefined && setIsSeller(false)
            setLoading(false)  
        })
    }, [])

    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }

    const SellerApp = ()=>{
        Linking.openURL('whatsapp://app').catch(()=>Linking.openURL("market://details?id=com.whatsapp"));
    }

    return (
        !showImage ? <View style={{flex:1}}>
            <BackGround/>
            <View style={{height:HEIGHT*.02}}/>
            {!loading ?<View style={{padding:20,flex:1}}>
                <RowView style={{justifyContent:'space-between', alignItems:'flex-start'}}>
                    <View>
                        <Text bold size={20}>Linkups</Text>
                        <Text size={13}>Profile</Text>
                    </View>
                </RowView>
                <View style={{alignItems:'center', alignSelf:'center'}}>
                    <Pressable onPress={()=>setShowImage(true)}>
                        <Image source={{uri:profile.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:IMAGE_SIZE}}/>
                    </Pressable>
                    <ImagePicker Update={Update} setLoading={setLoading} id={profile.id} style={styles.camera}>
                        <Feather name="camera" size={24} color={color.white} />
                    </ImagePicker>
                </View>
                <View style={{flex:.85, marginTop:20}}>
                    <Text size={20} style={{alignSelf:'center'}} bold>{profile.name}</Text>
                    <Text style={{alignSelf:'center'}} regular>+91 {profile.id.replace('91','')}</Text>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Pressable style={{padding:15}} android_ripple={{color:color.dark}} onPress={()=>navigation.navigate(CONSTANT.Address)}>
                            <Options>
                                <FontAwesome name="address-book" size={24} color={color.white} />
                                <Text>  My Address</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} onPress={SellerApp} android_ripple={{color:color.dark}}>
                            <Options>
                                <AntDesign name="customerservice" size={24} color={color.white} />
                                {!isSeller ? <Text>  Become a Seller</Text>: <Text>  Go To Seller App</Text>}
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} android_ripple={{color:color.dark}}>
                            <Options>
                                <Entypo name="language" size={24} color={color.white} />
                                <Text>  Language</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} onPress={()=>navigation.navigate(CONSTANT.Help)} android_ripple={{color:color.dark}}>
                            <Options>
                                <Entypo name="help" size={24} color={color.white} />
                                <Text>  Help & Support</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} android_ripple={{color:color.dark}} onPress={LOGOUT}>
                            <Options>
                                <MaterialIcons name="exit-to-app" size={24} color={color.red} style={{marginLeft:5}} />
                                <Text style={{color:color.red}} regular>   Logout</Text>
                            </Options>
                        </Pressable>
                    </View>
                </View>
            </View>:<Loading/>}
            <BottomBar/>
        </View>:
        <ImageViewer uri={profile.url} showImage={showImage} setShowImage={setShowImage}/>
    )
}

export default Index

const styles = StyleSheet.create({
    camera:{
        backgroundColor: color.active,
        padding:10,
        position:'absolute',
        bottom:-10,
        right:10,
        borderRadius:100
    }
})
