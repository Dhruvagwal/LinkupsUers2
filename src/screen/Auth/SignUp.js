import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Image, BackHandler, Pressable } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import TextInput from 'components/TextInput'
import CONSTANT from 'navigation/navigationConstant.json'
import {getCategory} from 'hooks/useData'
import {AuthConsumer} from 'context/auth'
import { MaterialIcons } from '@expo/vector-icons'; 
import {createUser} from 'hooks/useAuth'

const screens = ['name', 'address']

const TextInputField = ({label='', heading='', onPress = ()=>{}, setValue=()=>{}, pressLabel='Next'})=>{
    return <View style={{flex:1}}>
        <View style={{flex:.5, justifyContent:'space-evenly'}}>
            <Text size={20} bold>{heading}</Text>
            <TextInput  setValue={setValue} label={label}/>
        </View>
        <Pressable style={styles.next} onPress={onPress} android_ripple={{color:color.lightDark}}>
            <Text>{pressLabel}</Text>
            {pressLabel==='Next' && <MaterialIcons name="navigate-next" size={30} color={color.white} />}
        </Pressable>
    </View> 
}

const SignUp = ({route, navigation}) => {
    const [select, setSelect] = useState(screens[0])
    const [data, setData] = useState({subCategory:[]})
    const {PhoneNumber} = route.params
    const index = screens.indexOf(select)
    const {setAuth} = AuthConsumer()

    useEffect(() => {
        const backAction = () => {
            index>0 ? setSelect(screens[index-1]) : navigation.navigate(CONSTANT.Login)
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [index])
    const _onSubmit = async ()=>{
        const updateData={
            Address:data.address,
            name:data.name,
            phone: PhoneNumber 

        }
        await createUser(updateData)
        setAuth(true)
    }
    return (
        <View style={{flex:1, marginTop:25, padding:20}}>
            {select === screens[0] && <TextInputField label='Enter Name' heading='Your Name' onPress={()=>setSelect(screens[1])} setValue={(name)=>setData({...data, name})}/>}
            {select === screens[1] && <TextInputField label='Enter Address' onPress={_onSubmit} heading='Your Address' setValue={(address)=>setData({...data, address})} pressLabel='Submit'/>}
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    categoryContainer:{
        backgroundColor:color.elevatedDark,
        borderRadius:10,
        padding:10,
        marginBottom:20
    },
    activeSubCat:{
        backgroundColor:color.lightDark
    },
    next:{
        position:'absolute',
        bottom:-10,
        right:-10,
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        justifyContent:'center'
    }
})
