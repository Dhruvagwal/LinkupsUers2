import React from 'react'
import { StyleSheet, View, Dimensions, Pressable, Image, ImageBackground } from 'react-native'
import moment from 'moment'

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

import {Text, RowView} from 'styles'
import color from 'colors'
import TimeDiff from 'middlewares/TimeDiff'

const WIDTH = Dimensions.get('screen').width

const ServiceListView = ({data={}, category=[]}) => {
    const diff =TimeDiff(new Date(), new Date('2021-05-14'))
    const result = category.find(item=>item.id===data.info.category)
    const SubCat = result.subCategory.find(item=>item.id===data.info.subCategory)
    return (
        <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.OrderDescription,{data, category:result, SubCat})} style={styles.container}>
                <RowView>
                    <Image source={{uri:SubCat.url}} style={{width:100, height:100}}/>
                    <View style={{justifyContent: 'space-between',marginBottom:5, marginLeft:10,height:'80%'}}>
                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                        <RowView style={{justifyContent:'space-between'}}>
                            <Text size={12}>{diff}</Text>
                            <Text size={12} style={{textTransform:'capitalize'}}>{data.status}</Text>
                        </RowView>
                        <Text>{data.info.problem}</Text>
                    </View>
                </RowView>
        </Pressable>
    )
}

export default ServiceListView

const styles = StyleSheet.create({
    container:{
        marginBottom:10,
        overflow:'hidden',
        height:150,
        padding:10,
        justifyContent:'center',
        borderBottomColor:color.lightDark,
        borderBottomWidth:2.5
    }
})
