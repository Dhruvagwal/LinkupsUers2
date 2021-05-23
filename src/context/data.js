import React, {useContext, useEffect, useReducer} from 'react'

import CONSTANT from 'navigation/navigationConstant'

import CONTEXT from './CONTEXT.json'
import {AuthConsumer} from './auth'

import {getUsersDetails, getCategory} from 'hooks/useData'

const Context = React.createContext()

const INITIAL_STATE = {profile:{}}

const reducer = (state, action)=>{
    switch (action.type){
        case CONTEXT.UPDATE:
            return {...state, profile:action.profile}
        case CONTEXT.CATEGORY:
            return {...state, category:action.category}
        default:
            return state
    }
}

const DataProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const {state:{auth}} =AuthConsumer()

    const Update = async ()=>{
        const {data}= await getUsersDetails()
        dispatch({type:CONTEXT.UPDATE, profile:data})
    }
    const setCat = async (category)=>{
        dispatch({type:CONTEXT.CATEGORY, category})
    }


    return <Context.Provider value={{state, Update, setCat}}>
        {children}
    </Context.Provider>
}

const DataConsumer = ()=>{
    return useContext(Context)
}

export {DataProvider, DataConsumer}