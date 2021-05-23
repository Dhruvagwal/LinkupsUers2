import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput} from 'react-native'
import { MaterialIcons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import ImagePicker from 'components/ImagePicker'

import {Text, RowView} from 'styles'
import color from 'colors'
import ScreenModal from 'components/ScreenModal'
import Loading from 'components/Loading'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {getCategory} from 'hooks/useData'


const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const ScreenAddCategoryModal = ({visible, setCategory, text, data=[]})=>{
    return <ScreenModal>
        <Text>{text}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:20}}>
            {data.map((item)=><Pressable onPress={()=>setCategory(item)} key={item.id} style={styles.listView}>
                <RowView style={styles.containContainer}>
                    <Image source={{uri:item.url}} style={{height:90, width:90}}/>
                    <Text bold size={20} style={{width:'50%'}} numberOfLines={2} adjustsFontSizeToFit>{item.name}</Text>
                </RowView>
            </Pressable>
            )}
        </ScrollView>
    </ScreenModal>
}

const TextActive = ({active, setActive, children})=><Pressable onPress={()=>setActive({name:undefined})} style={{marginBottom:10}}>
    <RowView style={styles.TextActive}>
        <RowView>
            {children}
            <Text style={{marginLeft:10}}>{active}</Text>
        </RowView>
        <MaterialIcons name="arrow-drop-down" size={30} color={color.white} />
    </RowView>
</Pressable>

const TimingSlot = ({visible, setTiming})=>{
    const timingSlot = ['12:00 Pm to 3:00 Pm', '3:00 Pm to 6:00 Pm', '6:00 Pm to 9:00 Pm', '9:00 Pm to 12:00 Am' ]
    return <ScreenModal>
        <Text>Choose Timing</Text>
        {
            timingSlot.map(item=><Pressable onPress={()=>setTiming({name:item})} key={item} style={styles.timing}>
                <Text>{item}</Text>
            </Pressable>)
        }
    </ScreenModal>
}

const Problem = ({visible, setProblem})=>{
    const problem = ['Burning Smell', 'I Don\'t know', 'Short Circuit', 'Disconnect']
    return <ScreenModal>
        <Text>What's Problem</Text>
        {
            problem.map(item=>
            <Pressable onPress={()=>setProblem({name:item})} key={item} style={styles.timing}>
                <Text>{item}</Text>
            </Pressable>)
        }
    </ScreenModal>
}

const AddOrder = () => {
    var list = ['Choose Category', 'Choose Sub Category', 'Available Time', 'Problem Face']
    const [category, setCategory] = useState({name : list[0]})
    const [Subcategory, setSubCategory] = useState({name:list[1]})
    const [timing, setTiming] = useState({name: list[2]})
    const [problem, setProblem] = useState({name: list[3]})
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(()=>{

        getCategory().then(({data})=>{
            setData(data);
            setLoading(false)
        })

    },[])

    const CategoryData = ()=>{
        return data.map((item)=>(item))
    }
    const SubCatData=()=>{
        return data.filter(item=>item.name===category.name)[0].subCategory
    }
    const save = ()=>{
        const data = {
            category:category.id,
            subCategory:Subcategory.id,
            problem:problem.name,
            timing:timing.name
        }
        RootNavigation.navigate(CONSTANT.Invitation,data)
    }
    return (
        <View style={{flex:1}}>
            {loading ? 
                <Loading/>
            :
            <>
                <Background/>
                { timing.name===undefined && <TimingSlot setTiming={setTiming} visible={timing}/>}
                { problem.name === undefined && <Problem visible={problem} setProblem={setProblem}/>}
                { Subcategory.name === undefined && <ScreenAddCategoryModal data={SubCatData()} Subcategory setCategory={setSubCategory} text={'Choose Services'} visible={Subcategory}/>}
                { category.name === undefined && <ScreenAddCategoryModal data={CategoryData()} setCategory={setCategory} text={'Choose Service Category'} visible={category}/>}

                <View style={{height:HEIGHT*.05}}/>
                <View style={{margin:20}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Post Order</Text>
                </View>
                <ScrollView>
                <View style={{margin:20, flex:1}}>
                    <TextActive active={category.name} setActive={setCategory}>
                        <AntDesign name="customerservice" size={24} color={color.inActive} />
                    </TextActive>
                    {
                        category.name!==list[0] &&
                        <TextActive active={Subcategory.name} setActive={setSubCategory}>
                            <MaterialIcons name="category" size={24} color={color.inActive} />
                        </TextActive>
                    }
                    {
                        Subcategory.name!==list[1] &&
                        <TextActive active={timing.name} setActive={setTiming}>
                            <Entypo name="time-slot" size={20} color={color.inActive} />
                        </TextActive>
                    }
                    {
                        timing.name!==list[2] &&
                        <TextActive active={problem.name} setActive={setProblem}>
                            <MaterialIcons name="report-problem" size={24} color={color.inActive} />
                        </TextActive>
                    }
                    {
                        problem.name!==list[3] &&
                        <>
                        <ImagePicker style={{...styles.TextActive, alignItems:'center', justifyContent:'center', paddingLeft:10}}>
                            <RowView>
                                <Feather name="upload" size={30} color={color.active} />
                                <Text style={{marginLeft:10}}>Upload Image</Text>
                            </RowView>
                        </ImagePicker>
                        <Text>{'\n'}</Text>
                        <Text>{'\n'}</Text>
                        </>
                    }
                </View>
                </ScrollView>
                <Pressable style={styles.Button} onPress={save}>
                    <Text regular>Save</Text>
                </Pressable>
            </>}
        </View>

    )
}

export default AddOrder

const styles = StyleSheet.create({
    listView:{
        marginBottom:10,
        borderRadius:20,
        overflow:'hidden',
        height:100
    },
    containContainer:{
        width:'100%',
        height: '100%',
        justifyContent:'space-evenly',
        backgroundColor: color.lightDark,
    },
    TextActive:{
        backgroundColor: 'rgba(40, 49, 64,0.7)',
        padding:10,
        borderRadius:10,
        paddingLeft: 20,
        height:100,
        justifyContent:'space-between'
    },
    timing:{
        backgroundColor: color.lightDark,
        padding: 10,
        marginVertical:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    Button:{
        backgroundColor: color.active,
        position:'absolute',
        bottom:0,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    OkayButton:{
        backgroundColor: color.active,
        padding: 10,
        width:80,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:20,
        right: 20,
    }
})
