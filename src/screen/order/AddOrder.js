import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput, BackHandler, Alert} from 'react-native'
import { MaterialIcons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import ImagePicker from 'components/ImagePicker'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {getCategory} from 'hooks/useData'
import Calendar from 'components/calendar'
// import BackHandler from 'hooks/useBackHandler'


const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const stateList = ['category', 'subCategory', 'problem', 'time']

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const CategoryListView = ({data={}, setSelect, setState})=>{
    const _onPress = (item)=>{
        setState(res=>({...res, category:item.id}))
        setSelect(stateList[1])
    }
    return <View style={{padding:20}}>
        <Text size={13} regular>Select Category</Text>
        {
            data.map(item=><Pressable onPress={()=>_onPress(item)} key={item.id} style={styles.contentContainer} android_ripple={{color:color.lightDark}}>
                        <Image source={{uri:item.url}} style={{height:100, width:100}}/>
                        <Text style={{marginLeft:10}} size={20} bold>{item.name}</Text>
                </Pressable>
            )
        }
    </View>
}
const SubCategoryListView = ({data={}, setSelect,state, setState})=>{
    const _onPress = (item)=>{
        setState(res=>({...res, subCategory:item.id}))
        setSelect(stateList[2])
    }
    const sortList = data.find(item=>item.id === state.category)
    return <View style={{padding:20}}>
        <Text size={13} regular>{sortList.name}</Text>
        {
            sortList.subCategory.map(item=><Pressable onPress={()=>_onPress(item)} key={item.id} style={styles.contentContainer} android_ripple={{color:color.dark}}>
                        <Image source={{uri:item.url}} style={{height:100, width:100}}/>
                        <Text style={{marginLeft:10, width:'65%'}} size={15} bold>{item.name}</Text>
                </Pressable>
            )
        }
    </View>
}

const Time = ({setSelect,state, setState})=>{
    const [date, setDate] =useState()
    const [time, setTime] =useState()
    const _onPress = (item)=>{
        RootNavigation.navigate(CONSTANT.Invitation,{...state, time, date})
    }
    return <View style={{flex: 1,padding:10}}>
        <Calendar date={date} setDate={setDate} time={time} setTime={setTime}/>
        <Pressable onPress={_onPress} style={styles.Button}>
            <Text>Save</Text>
        </Pressable>
    </View>
}

const Problem = ({data={}, setSelect,state, setState}) =>{
    const problem = ['I Don\'t know?', 'Burning Problem', 'Short Circuit']
    const _onPress =async (item)=>{
        setState({...state, problem:item})
        setSelect(stateList[3])
    }
    return <View style={{padding:20}}>
        <Text size={13} regular>Problem Face</Text>
        {
            problem.map(item=><Pressable onPress={()=>_onPress(item)} key={item} style={[styles.contentContainer, {padding:20, justifyContent:'center'}]} android_ripple={{color:color.dark}}>
                <Text>{item}</Text>
            </Pressable>)
        }
    </View>
}

const AddOrder = ({navigation}) => {
    const [data, setData] = useState()
    const [select, setSelect] = useState(stateList[0])
    const [state, setState] = useState()
    const [loading, setLoading] = useState(true)
    var index = stateList.indexOf(select)
    useEffect(()=>{
        data===undefined && getCategory().then(({data})=>{
            setData(data);
            setLoading(false)
        })
        const backAction = () => {
            index>0 ? setSelect(stateList[index-1]):navigation.goBack()
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();

    },[index])
    return (
        <View style={{flex:1}}>
            {loading ? 
                <Loading/>
            :
            <>
                <Background/>
                <View style={{height:HEIGHT*.02}}/>
                <View style={{margin:20, marginBottom:0}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Post Order</Text>
                </View>
                {select===stateList[0] && <CategoryListView setSelect={setSelect} setState={setState} data={data}/>}
                {select===stateList[1] && <SubCategoryListView state={state} setSelect={setSelect} setState={setState} data={data}/>}
                {select===stateList[2] && <Problem state={state} setSelect={setSelect} setState={setState} data={data}/>}
                {select===stateList[3] && <Time state={state} setSelect={setSelect} setState={setState}/>}
            </>}
        </View>

    )
}

export default AddOrder

const styles = StyleSheet.create({
    Button:{
        backgroundColor: color.active,
        position:'absolute',
        bottom:0,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    contentContainer:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        marginVertical:10,
        padding:10,
        flexDirection:'row',
        alignItems:'center',
    },
})
