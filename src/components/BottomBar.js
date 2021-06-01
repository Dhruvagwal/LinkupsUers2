import React from 'react'
import { StyleSheet, View, Pressable  } from 'react-native'
import { Entypo, Ionicons, Feather } from '@expo/vector-icons'; 

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {DataConsumer} from 'context/data'
import {Text} from 'styles'
import color from 'colors'

const BottomBar = () => {
    const {state:{currentRouteName}} = DataConsumer()
    return (
        <View style={styles.container}>
            <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.Home)} style={styles.option}>
                <Entypo name="home" size={30} color={CONSTANT.Home === currentRouteName ? color.active : color.inActive} />
            </Pressable>
            <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.Library)} style={styles.option}>
                <Ionicons name="library" size={24} color={CONSTANT.Library === currentRouteName ? color.active : color.inActive} />
            </Pressable>
            <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.Setting)} style={styles.option}>
                <Feather name="menu" size={24} color={CONSTANT.Setting === currentRouteName ? color.active : color.inActive} />
            </Pressable>
        </View>
    )
}

export default BottomBar

const styles = StyleSheet.create({
    container:{
        backgroundColor: color.dark,
        position: 'absolute',
        bottom:0,
        width:'100%',
        height:80,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    option:{
        flexDirection:'row',
        alignItems:'center',
        padding:20
    }
})