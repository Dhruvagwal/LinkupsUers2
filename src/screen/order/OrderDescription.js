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
    const status = ['posted', 'inprogress', 'completed', 'paid']

    const Delete =async ()=>{
        await deleteData('order',data.id)
        RootNavigation.navigate(CONSTANT.Home)
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
        var list = []
        if (data.status===status[0]){
            data.invited>0 && data.invited.map(async item=>{
                    await getDataById('serviceProvider',item)
                    .then(({data})=>{
                        list = [...list, data]
                        setInvited(list)
                    })
                })
            data.proposal!== undefined && data.proposal.length > 0 ?data.proposal.map(async item=>{
                await getDataById('serviceProvider',item.id)
                .then(({data})=>{
                    list = [...list, data]
                    setProposal(list)
                })
                setLoading(false)
            }) : setLoading(false)
        }else{
            getDataById('serviceProvider',data.provider).then(({data})=>{
                setProvider(data)
                setLoading(false)
            })
        }
    }, [])

    return (
        <View style={{flex:1}}>          
                <View style={{height:HEIGHT*.05}}/>
                <Background/>
                {review && <FeedBackScreen data={data} provider={provider}/>}
                <View style={{margin:20, flex:1}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Order Detail</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>    
                        <View style={{marginTop:20}}>
                            <View style={{...styles.container, backgroundColor: '#0000'}}>
                                <RowView style={{height:100}}>
                                    <Image source={{uri:SubCat.url}} style={{width:100, height:100}}/>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:10, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text size={13}>Status:<Text regular style={{textTransform:'capitalize'}} size={13}> {data.status}</Text></Text>
                                        <Text size={13}>{data.info.timing}</Text>
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
                                                invited.map(item=><ServiceProviderListView key={Math.random().toString()} data={item}/>)
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
                        {data.status===status[0] && <Pressable onPress={Delete}>
                            <RowView style={{...styles.container, opacity:1, padding:20, alignItems:'center', justifyContent:'center'}}>
                            <MaterialCommunityIcons name="delete" size={24} color={color.red}/>
                                <Text style={{color:color.red}} regular>Delete</Text>
                            </RowView>
                        </Pressable>}
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
