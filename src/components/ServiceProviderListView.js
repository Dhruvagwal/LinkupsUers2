import React from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import moment from 'moment'

import {Text, RowView} from 'styles'
import color from 'colors'

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'


const ServiceProviderListView = ({data={}, proposal=false, orderId='', proposalData={}, invitation=false}) => {
    const IMAGE_SIZE = 90
    return (
        <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.ServiceProfile, {data, proposal, orderId, proposalData, invitation})}>
            <RowView style={styles.container}>
                <Image source={{uri:data.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:10}}/>
                {!invitation ? <View style={{paddingHorizontal:10, height:'95%', justifyContent: 'space-between',width:'75%'}}>
                    <RowView style={{alignItems:'flex-start'}}>
                        <RowView>
                            <MaterialIcons name="verified" size={24} color={color.blue} />
                            <Text regular size={18} style={{width:'65%'}} numberOfLines={1}> {data.name}</Text>
                        </RowView>
                        <RowView>
                            <AntDesign name="star" size={24} color={color.active} />  
                            <Text> 4.5</Text>
                        </RowView>
                    </RowView>
                    <Text size={20} regular>₹ {proposalData.price}</Text>
                    <RowView style={{justifyContent:'space-between'}}>
                        <Text>Deliver: {proposalData.date}</Text>
                    </RowView>
                </View>:
                <View style={{paddingHorizontal:10, height:'95%', justifyContent: 'space-between',width:'75%'}}>
                    <View style={{alignItems:'flex-start'}}>
                        <RowView>
                            <MaterialIcons name="verified" size={24} color={color.blue} />
                            <Text regular size={18} style={{width:'90%'}} numberOfLines={1}> {data.name}</Text>
                        </RowView>
                        <RowView>
                            <AntDesign name="star" size={24} color={color.active} />  
                            <Text> 4.5</Text>
                        </RowView>
                    </View>
                </View>
                }
                
            </RowView>
        </Pressable>
    )
}

export default ServiceProviderListView

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        padding:10,
        borderRadius:20,
        height:120,
        marginBottom:10
    },
    Call:{
        backgroundColor:color.active, 
        borderRadius:10, 
        padding: 5,
        alignItems:'center',
        justifyContent:'center'
    }
})
