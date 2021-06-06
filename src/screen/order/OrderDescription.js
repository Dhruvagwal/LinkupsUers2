import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, TextInput, Pressable } from 'react-native'
import { MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ServiceProviderListView from 'components/ServiceProviderListView'
import {deleteData, getDataById} from 'hooks/useData'
import {DataConsumer} from 'context/data'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {updateOrder} from 'hooks/useData'
import moment from 'moment';
import FeedBackScreen from './FeedBackScreen'
import { sendPushNotification } from 'middlewares/notification'


const HEIGHT= Dimensions.get('screen').height
const WIDTH= Dimensions.get('screen').width

const Background = ()=><View style={[{flex:1, alignItems:'stretch',flexDirection:'row'},StyleSheet.absoluteFillObject]}>
    <View style={{backgroundColor:color.dark, width:'85%'}}/>
    <View style={{backgroundColor:color.secondaryDark, width:'15%'}}/>
</View>

const Point = ({children, last=false,text=''})=><RowView style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    {children}
    <Text style={{marginLeft:10}}>{text}</Text>
</RowView>


const OrderDescription = ({route}) => {
    const {data, category, SubCat} = route.params
    const {state:{profile}} = DataConsumer()
    const [invited, setInvited] = useState([])
    const [proposal, setProposal] = useState([])
    const [review, setReview] = useState(false)
    const [provider, setProvider] = useState([])
    const [loading, setLoading] = useState(true)
    const [miniLoading, setMiniLoading] = useState(false)
    const status = ['posted', 'inprogress', 'completed', 'paid']

    const Delete =async ()=>{
        setMiniLoading(true)
        await deleteData('order',data.id)
        RootNavigation.navigate(CONSTANT.Library,{load:true})
        setMiniLoading(false)
    }

    const checkout =async ()=>{
        const UpdatedData = {
            status:status[3],
            paidOn:moment().format('LLL')
        }
        const notifyData = {
            title:`Payment Done`,
            body:`${profile.name} paid you`
        }
        await updateOrder(UpdatedData,data.id )
        await sendPushNotification(provider.token, notifyData)
        setReview(true)
    }
    useEffect(() => {
        if (data.status===status[0]){
            var Invitedlist = []
            data.invited>0 && data.invited.map(async item=>{
                await getDataById('serviceProvider',item)
                .then(({data})=>{
                    Invitedlist = [...Invitedlist, data]
                    setInvited(Invitedlist)
                })
            })
            var Propsallist = []
            data.proposal!== undefined && data.proposal.length > 0 ?data.proposal.map(async item=>{
                await getDataById('serviceProvider',item.id)
                .then(({data})=>{
                    Propsallist = [...Propsallist, data]
                    setProposal(Propsallist)
                })
                setLoading(false)
            }) : setLoading(false)
        }else{
            getDataById('serviceProvider',data.provider).then(({data})=>{
                setProvider(data)
                setLoading(false)
            })
        }
    }, [route.params])

    return (
        <View style={{flex:1}}>          
                <View style={{height:HEIGHT*.02}}/>
                <Background/>
                {review && <FeedBackScreen data={data} provider={provider}/>}
                <View style={{margin:20, flex:1}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Order Detail</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>    
                        <View style={{marginTop:10}}>
                            <View style={{...styles.container, backgroundColor: '#0000'}}>
                                <RowView style={{height:100}}>
                                    <Image source={{uri:SubCat.url}} style={{width:100, height:100}}/>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:10, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text size={13}>Status:<Text regular style={{textTransform:'capitalize', color:color.active}} size={13}> {data.status}</Text></Text>
                                        <Text size={13}>{moment(data.postedAt).format('LLL')}</Text>
                                    </View>
                                </RowView>
                            </View>
                            <Text style={{margin:10, marginBottom:0}} size={12}>Info</Text>
                            <View style={{...styles.container, backgroundColor: '#0000',paddingTop:0}}>
                                <Point text={category.name}>
                                    <AntDesign name="customerservice" size={24} color={color.active} />
                                </Point>
                                <Point text={'Delievery'}>
                                    <MaterialCommunityIcons name="truck-delivery" size={24} color={color.active} />
                                </Point>
                                <Point text={`${moment(data.postedAt).format('LL')} ${data.info.time}`}>
                                    <MaterialCommunityIcons name="truck-delivery" size={24} color={color.active} />
                                </Point>
                                <Point text={data.id}>
                                    <AntDesign name="idcard" size={24} color={color.active} />
                                </Point>
                                <Point text={data.info.problem} last>
                                    <MaterialIcons name="report-problem" size={24} color={color.active} />
                                </Point>
                            </View>
                            {!loading?
                                <>
                                    {data.status===status[0]?
                                        <>
                                        {proposal.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Proposals</Text>
                                            {
                                                proposal.map(item=><ServiceProviderListView key={Math.random().toString()} proposalData={data.proposal.find(response=>response.id===item.id)} orderId={data.id} data={item} category={category} proposal/>)
                                            }
                                        </View>}
                                        {invited.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Invited</Text>
                                            {
                                                invited.map(item=><ServiceProviderListView key={Math.random().toString()} data={item} invitation/>)
                                            }
                                        </View>}
                                        </>:
                                        <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Provider</Text>
                                            <ServiceProviderListView key={Math.random().toString()} orderId={data.id} proposalData={data.proposal.find(response=>response.id===provider.id)} data={provider} category={category}/>
                                        </View>
                                    }
                                </>
                                :
                                <Loading/>
                            }
                        </View>
                        <Text>{'\n'}</Text>
                        {!miniLoading ?
                            <>
                                {data.status===status[0] && <Pressable onPress={Delete}>
                                    <RowView style={{...styles.container, opacity:1, padding:20, alignItems:'center', justifyContent:'center'}}>
                                    <MaterialCommunityIcons name="delete" size={24} color={color.red}/>
                                        <Text style={{color:color.red}} regular>Delete</Text>
                                    </RowView>
                                </Pressable>}
                            </>
                            :
                            <View>
                                <Loading whole={false}/>
                            </View>
                        }
                    </ScrollView>
                </View>
                {
                    data.status === status[2] && <Pressable onPress={checkout} style={styles.bottomButton}>
                        <Text regular>Checkout</Text>
                    </Pressable>
                }
        </View>
    )
}

export default OrderDescription

const styles = StyleSheet.create({
    button:{
        backgroundColor: color.active,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0
    },
    container:{
        padding:10, 
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        borderRadius:20
    },
    Points:{
        borderBottomWidth:2,
        paddingVertical:10,
        borderBottomColor:color.lightDark
    },
    bottomButton:{
        backgroundColor: color.active,
        padding:20,
        alignItems:'center'
    }
})
