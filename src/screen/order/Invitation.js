import React,{useState, useEffect} from 'react'
import { Dimensions, StyleSheet, View, Image, ScrollView, Pressable } from 'react-native'

import { Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons'; 
import LottieView from 'lottie-react-native';

import {Text, RowView} from 'styles'
import Loading from 'components/Loading'
import color from 'colors'
import {getServiceProvider, saveOrder} from 'hooks/useData'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {DataConsumer} from 'context/data'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const IMAGE_SIZE = 110


const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-45deg'}, {translateY:-100}]}}/>
    </View>
}

const InvitationService = ({onPress, data})=>{
    const [pressed, setPressed] = useState(false)
    return <RowView style={styles.container}>
    <Image source={{uri:data.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:20}}/>
    <View style={{marginLeft:10, width:'63%', overflow:'hidden'}}>
        <RowView>
            <MaterialIcons name="verified" size={24} color={color.blue} />
            <Text style={{width:WIDTH/2.3, marginLeft:5}} numberOfLines={1} size={18} bold>{data.name}</Text>
        </RowView>
        <RowView>
            <Entypo name="address" size={24} color={color.active} />
            <Text style={{paddingVertical:5}}> 2.5m away</Text>
        </RowView>
        {
            !pressed ? <Pressable onPress={()=>{setPressed(true); onPress(data)}} style={[styles.InviteButton,{backgroundColor: color.active,}]}>
                <Text regular>Send Invite</Text>
            </Pressable> : <RowView>
                <Pressable onPress={()=>{setPressed(false); onPress(data)}} style={styles.InviteButton}>
                    <RowView regular style={{color:color.inActive}}>
                        <Ionicons name="checkmark-done" size={24} color={color.inActive} />
                        <Text>{' '}Invited</Text>
                    </RowView>
                </Pressable>
            </RowView>
        }
    </View>
</RowView>}

const Invitation = ({route}) => {
    const info = route.params
    const {state} = DataConsumer()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [invited, setInvited] = useState([])
    const [data, setData] = useState()
    const Save=async()=>{
        setLoading(true)
        const DATA = {
            invited,
            type:'service',
            user:state.profile.id,
            info:{...info, created:new Date()},
            id:'ORD-'+Math.floor(Math.random()*1000000)

        }
        await saveOrder(DATA)
        setSuccess(true)
        setTimeout(()=>{setSuccess(false);RootNavigation.navigate(CONSTANT.Home)}, 3000)
    }

    useEffect(() => {
        getServiceProvider().then(({data})=>{setData(data); setLoading(false)})
    }, [])

    const Invite = (data)=>{
        invited.length === 0 && setInvited([data.id])
        const result = invited.filter(item=>item===data.id)
        result.length === 0 ? setInvited([...invited, data.id]):setInvited(invited.filter(item=>item!==data.id))
    } 
        
    return (
        <View style={{flex:1}}>
            <Background/>
           {!success? <>
                <View style={{height:HEIGHT*.05}}/>
                <View style={{margin:20}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Post Order</Text>
                </View>
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                    <View style={{margin:20, marginTop:0, flex:1}}>
                        {!loading ? <>
                            <Text>Send Invitations</Text>
                            {
                                data.map(item=><InvitationService onPress={Invite} data={item} key={item.id} data={item}/>)
                            }
                        </>
                        :
                        <Loading/>
                        }
                    </View>
                {/* </ScrollView> */}
                <Pressable onPress={Save} style={{position:'absolute', bottom:0, width:WIDTH, alignItems:'center', backgroundColor:color.active, padding:20}}>
                    <Text regular>Submit</Text>                
                </Pressable>
            </> :<View>            
                <LottieView
                    source={require('../../../assets/lottieFiles/loading.json')}
                    style={styles.loading}
                    autoPlay
                />
                <LottieView
                    source={require('../../../assets/lottieFiles/popper.json')}
                    style={{width:WIDTH, height:HEIGHT, position:'absolute'}}
                    autoPlay
                />
            </View>
            }
        </View>
    )
}

export default Invitation

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(34, 42, 56,0.8)',
        borderRadius:20,
        padding:10,
        marginTop:10
    },
    loading:{
        width:WIDTH,
        height:HEIGHT,
        alignSelf:'center',
    },
    InviteButton:{
        backgroundColor:color.lightDark, 
        padding:5, 
        borderRadius:10, 
        alignItems:'center', 
        width:'100%', 
        height:45, 
        justifyContent:'center', 
        alignItems:'center'
    }
})
