import React, {useState, useEffect, useRef} from 'react'
import { RefreshControl, StyleSheet, Image, View ,Dimensions, Pressable, ScrollView, FlatList, Animated, Modal, Switch } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, Ionicons } from '@expo/vector-icons'; 
import axios from 'axios'

import {Text, RowView} from 'styles'
import color from 'colors' 
import ServiceListView from 'components/ServiceListView' 
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import Filter from './filter'
import TimeDiff from 'middlewares/TimeDiff'
import BottomBar from 'components/BottomBar'
import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'
import {getPost, getCategory, updateUserProfile} from 'hooks/useData'
import{ registerForPushNotificationsAsync } from 'middlewares/notification'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const PADDING = 20

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}


const Index = ({route}) => {
    const {state:{auth}} = AuthConsumer()
    const routes = route.params
    const {setCat, state:{profile}, Update} = DataConsumer()
    const ServiceStatus = ['Service', 'Product'] 
    const [active, setActive] = useState(ServiceStatus[0])
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [category, setCategory] = useState([])
    const [filter, setFilter] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [filterList, setFilterList] = useState([])

    const loadData = async (token)=>{
        setRefreshing(true);
        var postData = await getPost("service", token)
        postData = postData.data.filter(({status})=>status!=='cancelled')
        setData(postData)
        if(category.length===0){
            const Category = await getCategory(token)
            setCategory(Category.data)
            setCat(Category.data)
        }
        const tokenNot = await registerForPushNotificationsAsync()
        tokenNot !== profile.token && await updateUserProfile({token:tokenNot})
        Update()
        setLoading(false); 
        setRefreshing(false)
    }
    useEffect(() => {
        setLoading(true)
        if(active===ServiceStatus[0]){
            auth && loadData()
        }
    }, [routes])
    const order = async ()=>{
        auth && RootNavigation.navigate(CONSTANT.AddOrder)
    }

    const applyFilter =async ()=>{
        setRefreshing(true);
        setFilter(false) 
        const postData = await getPost("service")
        if(filterList.length!==0){
            const filter_Result = postData.data.filter(({status})=>filterList.find(item=>item.toLowerCase()===status)) 
            setData(filter_Result)
        }else{
            setData(postData.data)
        }
        setRefreshing(false);
    }
    return (
        <View style={{flex:1}}>
            <Background/>
            {filter && <Filter filterList={filterList} applyFilter={applyFilter} setFilterList={setFilterList} setFilter={setFilter}/>}
            {/* ======================= */}
            <View style={{height:HEIGHT*.02}}/>
            {/* ======================== */}
            <View style={{flex:1, padding:20}}>
                <RowView style={{marginBottom:20, justifyContent:'space-between'}}>
                    <View>
                        <Text size={20} bold>Linkups</Text>
                        <Text size={13}>Library</Text>
                    </View>
                    <RowView>
                        <Pressable onPress={()=>setFilter(true)} style={{padding:5}}>
                            <Ionicons name="filter-outline" size={30} color={color.white} />
                        </Pressable>
                    </RowView>
                </RowView>
                {/* ====================== */}
                {(active===ServiceStatus[0] && auth) && <>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        style={{flex:1}} 
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={loadData}
                                color={[color.active]}
                            />
                        }
                    >
                        {/* <Carousel/> */}
                        {loading ?<View style={{height:HEIGHT*.5, alignItems:'center', justifyContent:'center'}}/>
                        :   <>
                            { data
                                .sort((a,b)=>TimeDiff(a.postedAt).minutes-TimeDiff(b.postedAt).minutes)
                                .map(
                                    item=>
                                        <ServiceListView data={item} category={category} status={active} key={item.id}/>
                                    )
                            }
                        </>
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>
                    </>
                }
            </View>
            <BottomBar/>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    PostButton:{
        backgroundColor:color.active,
        position:'absolute',
        bottom:0,
        padding:PADDING,
        width:WIDTH,
        alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        height:70
    },
    contain:{
        padding:PADDING*.5,
        borderTopRightRadius:PADDING*.25,
        borderTopLeftRadius:PADDING*.25,
        textAlign:'center'
    },
    active:{
        backgroundColor:color.active,
        padding:2.5
    },
    menu:{
        position:'absolute', 
        right:25, 
        top:HEIGHT*.05, 
        backgroundColor: color.elevatedDark,
        borderRadius:5,
        width:WIDTH/1.8,
        elevation:5,
        zIndex:5,
        paddingVertical:10
    },
    menuItems:{
        padding:10
    }
})
