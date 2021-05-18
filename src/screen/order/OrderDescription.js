import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, TextInput, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ServiceProviderListView from 'components/ServiceProviderListView'
import {deleteData, getDataById} from 'hooks/useData'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'


const HEIGHT= Dimensions.get('screen').height
const WIDTH= Dimensions.get('screen').width

const Background = ()=><View style={[{flex:1, alignItems:'stretch',flexDirection:'row'},StyleSheet.absoluteFillObject]}>
    <View style={{backgroundColor:color.dark, width:'85%'}}/>
    <View style={{backgroundColor:color.secondaryDark, width:'15%'}}/>
</View>

const Point = ({children, last=false})=><View>
    <Text style={{...styles.Points, borderBottomWidth:last ? 0:2}}>{children}</Text>
</View>


const OrderDescription = ({route}) => {
    const {data, category, SubCat} = route.params
    const [invited, setInvited] = useState([])
    const [loading, setLoading] = useState(true)

    const Delete =async ()=>{
        await deleteData('order',data.id)
        RootNavigation.navigate(CONSTANT.Home)
    }
    useEffect(() => {
        var list = []
        data.invited.map(async item=>{
            await getDataById('serviceProvider',item)
                .then(({data})=>{
                    list = [...list, data]
                    setInvited(list)
                })
                setLoading(false)
            })
    }, [])
    return (
        <View style={{flex:1}}>
            {!loading
            ?<>            
                <View style={{height:HEIGHT*.05}}/>
                <Background/>
                <View style={{margin:20, flex:1}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Order Detail</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>    
                        <View style={{marginTop:20}}>
                            <View style={styles.container}>
                                <RowView style={{height:100}}>
                                    <Image source={{uri:SubCat.url}} style={{width:100, height:100}}/>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:5, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text>Status:<Text regular> Posted</Text></Text>
                                        <Text>{data.info.timing}</Text>
                                    </View>
                                </RowView>
                            </View>
                            <Text style={{margin:10}} size={12}>Info</Text>
                            <View style={{...styles.container}}>
                                <Point>{category.name}</Point>
                                <Point>Delievery</Point>
                                <Point last>{data.info.problem}</Point>
                            </View>
                            {/* <View style={{marginTop:10}}>
                                <Text style={{margin:10}} size={12}>Proposals</Text>
                                <ServiceProviderListView/>
                                <ServiceProviderListView/>
                                <ServiceProviderListView/>
                            </View> */}
                            <View style={{marginTop:10}}>
                                <Text style={{margin:10}} size={12}>Invited</Text>
                                {
                                    invited.map(item=><ServiceProviderListView key={Math.random().toString()} data={item}/>)
                                }
                            </View>
                        </View>
                        <Text>{'\n'}</Text>
                        <Pressable onPress={Delete}>
                            <RowView style={{...styles.container, opacity:1, padding:20, alignItems:'center', justifyContent:'center'}}>
                            <MaterialCommunityIcons name="delete" size={24} color={color.red}/>
                                <Text style={{color:color.red}} regular>Delete</Text>
                            </RowView>
                        </Pressable>
                    </ScrollView>
                </View>
            </>:
            <Loading/>
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
        marginHorizontal:10,
        borderBottomColor:color.lightDark
    }
})
