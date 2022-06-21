import createDataContext from "./createDataContext";
import loginApi from "../api/login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigationRef'; 
var forge = require('node-forge');
var pki=forge.pki;

const authReducer = (state,action) => {
    switch (action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signup':
            return {errorMessage:'', token: action.payload};
        case 'signin':
            return {errorMessage:'', token: action.payload};
        case 'clear_error_message':
            return { ...state, errorMessage: '' }
        case 'signout':
            return { ...state, token: null, publicKey: null, privateKey:null}
        case 'public_key_gen':
            return { ... state, publicKey: action.payload}
        case 'private_key_gen':
            return { ... state, privateKey: action.payload}
        default:
            return state;
    }
};

const generateKeys = dispatch => async () => {
     console.log('reaches generatekeys');
     try{
        //generate keypair and assign to public and private
        const keyPair = pki.rsa.generateKeyPair(2048);

        const publicKey = keyPair.publicKey;
       
        dispatch({type:'public_key_gen', payload:publicKey});
        try{
            await AsyncStorage.setItem('publicKey', publicKey);
        }
        catch(err){
            dispatch({ type: 'add_error', payload: 'Problem storing public key'});
            console.log(err.response.data);
        }

        const privateKey = keyPair.privateKey;
        dispatch({type:'private_key_gen', payload:privateKey});
        try{
            await AsyncStorage.setItem('privateKey', privateKey);
        }
        catch(err){
            dispatch({ type: 'add_error', payload: 'Problem storing public key'});
            console.log(err.response.data);
        }
    }
    catch(err){
        dispatch({ type: 'add_error', payload: 'Problem generating keys'});
        console.log(err.response.data);
    }
}

const tryLocalSignIn = dispatch => async () => {
    //attempt to get token to see if user is logged in
    const token = await AsyncStorage.getItem('token');
    if(token){
        dispatch({type: 'signin', payload: token});
        navigate('mainFlow');
    } else{
        navigate('loginFlow');
    }
};

const clearErrorMessage = dispatch => () => {
    //clean error message state
    dispatch({ type: 'clear_error_message' });
};

const signup = (dispatch) => {
    return async ( { email, password } ) => {
        //make api request to sign up
        try {
            //signin with api
            const response = await loginApi.post('/signup', {email, password});
            //save jwt in storage
            try{
                await AsyncStorage.setItem('token', response.data.token);
            }
            catch(err){
                dispatch({ type: 'add_error', payload: 'Problem storing JWT'});
                console.log(err.response.data);
            }
            //add token to state and move to landing page  
            dispatch({ type:'signup', payload: response.data.token});
            generateKeys;
            navigate('mainFlow');
        }
        catch (err) {
            dispatch({ type: 'add_error', payload: 'Something went wrong when signing up'});
            console.log(err.response.data);
        }

    };
};

const signin = (dispatch) => {
    return async ( { email, password } ) => {
        try {
            //attempt login 
            const response = await loginApi.post('/signin', {email, password});

            //store jwt for login over multiple sessions
            try{
                await AsyncStorage.setItem('token', response.data.token);
                dispatch({ type:'signin', payload: response.data.token});
            }  
            catch(err){
                dispatch({ type: 'add_error', payload: 'Problem storing JWT'});
                console.log(err.response.data);
            }  
            
            console.log('reaches generatekeys');
            try{
               //generate keypair and assign to public and private
               const keyPair = pki.rsa.generateKeyPair(2048);
                console.log('gets past basic generation');
               dispatch({type:'public_key_gen', payload:keyPair.publicKey});
               /*try{
                   await AsyncStorage.setItem('publicKey', keyPair.publicKey);
               }
               catch(err){
                   dispatch({ type: 'add_error', payload: 'Problem storing public key'});
                   console.log(err.response.data);
               }*/
       
               dispatch({type:'private_key_gen', payload:keyPair.privateKey});
               /*try{
                   await AsyncStorage.setItem('privateKey', keyPair.privateKey);
               }
               catch(err){
                   dispatch({ type: 'add_error', payload: 'Problem storing public key'});
                   console.log(err.response.data);
               }*/
           }
           catch(err){
               dispatch({ type: 'add_error', payload: 'Problem generating keys'});
               console.log(err.response.data);
           }

            //move to main flow(account page, landing page, etc)
            navigate('mainFlow');
        }
        catch (err) {
            dispatch({ type: 'add_error', payload: 'Incorrect email or password'});
            console.log(err.response.data);
        }
    };
};

const signout = dispatch => {
    return async () => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            try{
                //try to remove the token to log them out
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('publicKey');
                await AsyncStorage.removeItem('privateKey');
                dispatch({type: 'signout', payload: token});
            }
            catch(err){
                dispatch({ type: 'add_error', payload: 'Problem removing JWT'});
                console.log(err.response.data);
            }  
        }
        navigate('loginFlow');
    };
};


export const { Provider, Context } = createDataContext(
    authReducer,
    { signup, signin, signout, clearErrorMessage, tryLocalSignIn, generateKeys },
    { token:null, errorMessage:'', publicKey:null, privateKey:null }
);