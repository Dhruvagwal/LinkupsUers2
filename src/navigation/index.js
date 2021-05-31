import React, {useEffect, useState, useRef} from 'react'
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import LanguageScreen from 'screen/setting/language'
import AddOrderScreen from 'screen/order/AddOrder'
import OrderDescriptionScreen from 'screen/order/OrderDescription'
import InvitationScreen from 'screen/order/Invitation'
import ServiceProfileScreen from 'screen/profile/ServiceProfile'
import SettingScreen from 'screen/setting'
import LibraryScreen from 'screen/Library'

import {navigationRef} from './RootNavigation';
import {AuthConsumer} from '../context/auth'
import {DataConsumer} from '../context/data'
import { verifyToken } from '../hooks/useAuth'

import color from 'colors'
const routeNameRef = React.createRef();
const Index = () => {
  useEffect(()=>{
    verifyToken()
      .then(response=>{setAuth(response); setLoading(false)})
      .catch(err=>setAuth(false))

    return ()=>{}
  },[])
    const Stack = createStackNavigator()
    const [Loading, setLoading] = useState(true)
    const {setName} = DataConsumer()
    const {state:{auth}, setAuth} = AuthConsumer()


    const BlackTheme = {
        dark: true,
        colors: {
          background: color.dark,
        },
      };

    return (<NavigationContainer 
                    ref={navigationRef} 
                    onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                    onStateChange={async () => {
                        const name = await navigationRef.current.getCurrentRoute().name
                        setName(name)
                    }} 
                    theme={BlackTheme}
                >
                <Stack.Navigator headerMode={false} screenOptions={{ animationEnabled: false }} >
                    {Loading && <Stack.Screen name={CONSTANT.Loading} component={LoadingScreen}/>}
                    <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                    {auth && <>
                      <Stack.Screen name={CONSTANT.Language} component={LanguageScreen}/>
                      <Stack.Screen name={CONSTANT.OrderDescription} component={OrderDescriptionScreen}/>
                      <Stack.Screen name={CONSTANT.AddOrder} component={AddOrderScreen}/>
                      <Stack.Screen name={CONSTANT.Invitation} component={InvitationScreen}/>
                      <Stack.Screen name={CONSTANT.ServiceProfile} component={ServiceProfileScreen}/>
                      <Stack.Screen name={CONSTANT.Setting} component={SettingScreen}/>
                      <Stack.Screen name={CONSTANT.Library} component={LibraryScreen}/>
                    </>}
                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Index

