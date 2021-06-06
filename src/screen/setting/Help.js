import React from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors';
const CustomTextInput = ({label, numberOfLines=1})=>{
    return <RowView style={styles.TextInput}>
        <TextInput
            placeholder={label}
            placeholderTextColor={color.inActive}
            style={styles.CustomTextInput}
            numberOfLines={numberOfLines}
            multiline
            textAlignVertical='top'
        />
        <Pressable style={{position:'absolute', bottom:10, right:10}} onPress={()=>console.log('trigger')}>
            <FontAwesome name="microphone" size={24} color={color.white} />
        </Pressable>
    </RowView>
}

const Help = () => {
    const _onPress = ()=>{
        
    }
    return (
            <View style={{paddingTop:25, padding:20, flex:1}}>  
                <View style={{marginVertical:50}}>
                    <Text size={25} bold>Help & Support</Text>
                </View>
                <View style={{flex:1}}>
                    <CustomTextInput label='Problem Face'/>
                    <CustomTextInput label='Some Words' numberOfLines={5}/>
                    <Pressable onPress={_onPress} android_ripple={{color:'#ff836b'}} style={styles.button}>
                        <Text regular>Submit</Text>
                    </Pressable>
                </View>    
            </View>
    )
}

export default Help

const styles = StyleSheet.create({
    TextInput:{
        borderColor:color.blue,
        borderWidth:0.5,
        borderRadius:5,
        width:'100%',
        marginVertical:10,

    },
    button:{
        backgroundColor:color.active,
        padding:10,
        borderRadius:5,
        alignItems:'center',
        alignSelf:'center',
        marginTop:20,
        width:'50%'
    },
    CustomTextInput:{
        fontSize:20,
        color:color.white,
        fontFamily:'Montserrat' ,
        width:'100%',
        padding:10,
    }
})
