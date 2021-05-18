import React, {useState, useEffect, useRef} from 'react'
import { RefreshControl, StyleSheet, Image, View ,Dimensions, Pressable, ScrollView, FlatList, Animated, Modal, Switch } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, Ionicons } from '@expo/vector-icons'; 
import axios from 'axios'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import Login from './Login'
import ServiceListView from 'components/ServiceListView' 
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {AuthConsumer} from 'context/auth'
import {getPost, getCategory} from 'hooks/useData'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const PADDING = 20

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}

const MenuModal = ({setMenu, visible})=>{
    return (
        <Modal transparent visible={visible}>
            <Pressable onPress={()=>setMenu(false)} style={{flex:1}} >
                <View style={styles.menu}>
                    <RowView style={styles.menuItems}>
                        <MaterialIcons name="edit" size={24} color={color.inActive} />
                        <Text>{'  '}Edit Profile</Text>
                    </RowView>
                    <RowView style={styles.menuItems}>
                        <Entypo name="address" size={24} color={color.inActive} />
                        <Text>{'  '}Change Address</Text>
                    </RowView>
                    <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.Language)}>
                        <RowView style={styles.menuItems}>
                            <Entypo name="language" size={24} color={color.inActive} />
                            <Text>{'  '}Language</Text>
                        </RowView>
                    </Pressable>
                    <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.Setting)}>
                        <RowView style={styles.menuItems}>
                            <AntDesign name="setting" size={24} color={color.inActive}/>
                            <Text>{'  '}Setting</Text>
                        </RowView>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
)}

const Index = () => {
    const {state:{auth}} = AuthConsumer()
    const ServiceStatus = ['Service', 'Product'] 
    const [active, setActive] = useState(ServiceStatus[0])
    const [loading, setLoading] = useState(false)
    const [menu, setMenu] = useState(false)
    const [data, setData] = useState([])
    const [category, setCategory] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    const loadData = async (token)=>{
        setRefreshing(true);
        const postData = await getPost("service", token)
        setData(postData.data)
        const Category = await getCategory(token)
        setCategory(Category.data)
        setLoading(false); 
        setRefreshing(false)
    }

    useEffect(() => {
        let source = axios.CancelToken.source()
        setLoading(true)
        loadData(source.token)
        return ()=>{
            source.cancel()
        }
    }, [active])


    const order = async ()=>{
        auth && RootNavigation.navigate(CONSTANT.AddOrder)
    }
    return (
        <View style={{flex:1}}>
            {!auth && <Login/>}
            <Background/>
            {/* ======================= */}
            <View style={{height:HEIGHT*.05}}/>
            {/* ======================== */}
            <View style={{padding:PADDING, flex:1}}>
                <RowView style={{marginBottom:30, justifyContent:'space-between'}}>
                    <View>
                        <Text size={30} bold>Linkups</Text>
                        <Text>Home</Text>
                    </View>
                    <RowView>
                        <Pressable style={{padding:5}}>
                            <Ionicons name="filter-outline" size={30} color={color.white} />
                        </Pressable>
                        <Pressable style={{padding:5}} onPress={()=>setMenu(!menu)}>
                            <MaterialCommunityIcons name="dots-vertical" size={30} color={color.white}/>
                        </Pressable>
                    </RowView>
                </RowView>
                <MenuModal visible={menu} setMenu={setMenu}/>
                {/* ====================== */}
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={ServiceStatus}
                    style={{alignSelf:'center', flexGrow:0, marginBottom:20}}
                    keyExtractor={(item)=>item}
                    renderItem={({item})=>
                    <Pressable onPress={()=>setActive(item)} key={item}>
                        <Text style={{...styles.contain,backgroundColor:item===active?color.lightDark:'#0000', width:ServiceStatus.length<=2 ? WIDTH/ServiceStatus.length-20:150}}>{item}</Text>
                        {item===active && <View style={styles.active}/>}
                    </Pressable>}
                />
                {/* =============================== */}
                {auth && <>
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
                        {loading ?<View style={{height:HEIGHT*.5, alignItems:'center', justifyContent:'center'}}>
                                <Loading/>
                        </View>
                        :
                            data.map(item=><ServiceListView data={item} category={category} status={active} key={item.id}/>)
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>
                    </>
                }
                </View>
            {/* ======================= */}
            {
                auth &&
                <Pressable onPress={order} style={styles.PostButton}>
                    <Text regular>Place {active}</Text>
                </Pressable>

            }
            {/* ======================= */}
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    PostButton:{
        backgroundColor:color.active,
        position:'absolute',
        bottom:0,
        right:0,
        padding:PADDING,
        width:WIDTH,
        alignItems:'center',
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
        padding:10,
        borderRadius:5,
        width:WIDTH/1.8,
        elevation:5,
        zIndex:5
    },
    menuItems:{
        paddingVertical:10
    }
})
