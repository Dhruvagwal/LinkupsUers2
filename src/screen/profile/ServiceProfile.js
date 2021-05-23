import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, StatusBar, ImageBackground, Pressable } from 'react-native'
import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo, SimpleLineIcons, MaterialIcons} from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import moment from 'moment';
import Loading from 'components/Loading'
import { updateOrder } from 'hooks/useData'
import {DataConsumer} from 'context/data'
import { sendPushNotification } from 'middlewares/notification'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-30deg'}, {translateY:-100}]}}/>
    </View>
}

const IMAGE_SIZE = 200

const Review=({data={}})=><View style={{...styles.contentContainer, backgroundColor: 'rgba(34, 42, 56,0.8)',}}>
    <RowView>
        <View style={{marginLeft:10}}>
            <Text><AntDesign name="star" size={15} color={color.active} /> {Math.round(data.rating*1.2*100)/100}</Text>
        </View>
    </RowView>
    <View>
        <Text size={12} style={{width:'100%'}} numberOfLines={2}>{data.review}</Text>
    </View>
</View>

const Point = ({children, last=false, text})=><RowView style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    {children}
    <Text style={{marginLeft:10}}>{text}</Text>
</RowView>

const ServiceProfile = ({route}) => {
    const {data, proposal, orderId, proposalData} = route.params
    const [loading, setLoading] = useState(false)
    const [pro, setPro] = useState('')
    const {state} = DataConsumer()
    useEffect(() => {
        const result = state.category.find(item=>item.id === data.category)
        setPro(result.name)
    }, [])
    const accept = async ()=>{
        setLoading(true)
        const updateData = {
            provider: data.id,
            startsOn:new Date(),
            status:'inprogress'
        }
        const notifyData = {
            title:`Got New Order`,
            body:`${state.profile.name} accepted your proposal`
        }
        await updateOrder(updateData, orderId)
        await sendPushNotification(data.token, notifyData)
        setLoading(false)
    }
    return (
        <View style={{flex:1}}>
            <Background/>
            <View style={{height:HEIGHT*.05}}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding:20}}>
                    <Image source={{uri:data.url}} style={styles.image}/>
                    <View style={styles.container}>
                        <View style={{alignSelf:'center', marginBottom:10}}>
                            <Text size={20} bold>{data.name}</Text>
                            <RowView style={{alignSelf: 'center',}}>
                                <MaterialIcons name="verified" size={24} color={color.blue} />
                                <Text> {pro}</Text>
                            </RowView>
                        </View>
                        <View style={{padding:10}}>
                            <RowView>
                                <View style={[styles.options, {borderRightWidth:2.5, borderRightColor:color.lightDark}]}>
                                    <Text size={20} bold>250m <MaterialCommunityIcons name="map-marker-distance" size={24} color={color.active}/></Text>
                                    <Text>away</Text>
                                </View>
                                <View style={styles.options}>
                                    <Text size={20} bold>4.5 <AntDesign name="star" size={24} color={color.active} /></Text>
                                    <Text>Rating</Text>
                                </View>
                            </RowView>
                        </View>
                    </View>


                    <Text size={12} style={{margin:10, marginBottom:-5}}>Details</Text>
                    <View style={styles.contentContainer}>
                        <Point>
                            <Entypo name="price-tag" size={24} color={color.active} />
                            <RowView style={{marginLeft:10}}>
                                <Text>Price:</Text>
                                <Text size={20} regular> {`₹ ${proposalData.price}`}</Text>
                            </RowView>
                        </Point>
                        <Point text={proposalData.date}>
                            <MaterialIcons name="date-range" size={24} color={color.active} />
                        </Point>
                        <Point text={`+${data.id}`}>
                            <Ionicons name="call" size={24} color={color.active} /> 
                        </Point>
                        <Point text={data.Address}>
                            <Entypo name="address" size={24} color={color.active} />
                        </Point>
                        <Point last text={`Since ${moment(data.createdOn).format('DD-MM-YYYY')}`}>
                            <Entypo name="flag" size={24} color={color.active}/>
                        </Point>
                    </View>


                    <View style={{marginTop:10}}>
                        <Text size={12} style={{margin:10, marginBottom:-5}}>Customer Reviews</Text>
                        {
                            data.rating.map(item=><Review key={Math.random().toString()} data={item}/>)
                        }
                    </View>

                    
                    <Text>{'\n'}</Text>
                    <Text>{'\n'}</Text>
                </View>
            </ScrollView>
            {!loading ?
            <>
                {proposal && <Pressable onPress={accept} style={{position:'absolute',bottom:0, backgroundColor:color.active, width:'100%', alignItems:'center', padding:15}}>
                    <Text size={20} bold>Accept</Text>
                </Pressable>}
            </>:
            <Loading/>}
        </View>
    )
}

export default ServiceProfile

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(34, 42, 56,0.0)',
        marginTop:-IMAGE_SIZE/2,
        paddingTop:IMAGE_SIZE/2+10,
        borderRadius:20,
        paddingBottom:10
    },
    options:{
        alignItems:'center',
        width:'50%'
    },
    contentContainer:{
        backgroundColor:'rgba(34, 42, 56,0.0)',
        marginTop:10,
        padding:10,
        borderRadius:20
    },
    Points:{
        borderBottomWidth:2,
        paddingVertical:10,
        borderBottomColor:color.lightDark
    },
    image:{
        height:IMAGE_SIZE, 
        width:IMAGE_SIZE, 
        borderRadius:IMAGE_SIZE, 
        alignSelf:'center', 
        zIndex:1000,
        overflow:'hidden'
    },
    blueChip:{
        borderWidth:5,
        borderColor: color.blue
    },
    imageText:{
        position:'absolute',
        bottom:0,
        alignSelf:'center',
        padding:10,
        justifyContent:'center',
    }
})
