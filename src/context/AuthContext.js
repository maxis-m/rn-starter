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


/**
 * Makes a certificate signing request (CSR).
 *
 * @param privateKey private key object (NOT a pem string)
 * @param publicKey public key object (NOT a pem string)
 * @param nameValue string to put in commonName field of certificate
 *
 * @returns PEM string format of certificate signing request.
 */
const makeCSR = (publicKey, privateKey, username) => {
  
    var csr = forge.pki.createCertificationRequest();
    csr.publicKey = publicKey;
    // set (optional) attributes
    csr.setAttributes({
        name: 'username',
        value: username
    });

    // sign certification request
    csr.sign(privateKey);

    // convert certification request to PEM-format
    const pem = forge.pki.certificationRequestToPem(csr);
    console.log(pem);
    //console.log(pem);
    return pem;
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
    return async ( { username, password } ) => {
        //make api request to sign up
        try {
            //signin with api
            const response = await loginApi.post('/signup', {username, password});
            //save jwt in storage
            try{
                await AsyncStorage.setItem('token', response.data.token);
                console.log('reaches generatekeys');
                try{
                   const keys = pki.rsa.generateKeyPair(2048);
                    console.log('gets past basic generation');

                    //await AsyncStorage.setItem('publicKey', keys.publicKey);
                    //await AsyncStorage.setItem('privateKey', keys.privateKey);

                    const pem = await AsyncStorage.getItem('authcsr');

                    if(!pem){
                        const csr = makeCSR(keys.publicKey, keys.privateKey, username);
                        try{await AsyncStorage.setItem('authcsr', csr);}
                        catch(err){
                            console.log(err);
                        }
                    }
                }
                catch(err){
                    dispatch({ type: 'add_error', payload: 'Problem generating keys'});
                    console.log(err);
                }
            }
            catch(err){
                dispatch({ type: 'add_error', payload: 'Problem storing JWT'});
                console.log(err.response.data);
            }
            //add token to state and move to landing page  
            dispatch({ type:'signup', payload: response.data.token});
            navigate('mainFlow');
        }
        catch (err) {
            dispatch({ type: 'add_error', payload: 'Something went wrong when signing up'});
            console.log(err.response.data);
        }

    };
};

const signin = (dispatch) => {
    return async ( { username, password } ) => {
        try {
            //attempt login 
            const response = await loginApi.post('/signin', {username, password});

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
               const keys = pki.rsa.generateKeyPair(2048);
                console.log('gets past basic generation');
                
                //await AsyncStorage.setItem('publicKey', keys.publicKey);
                //await AsyncStorage.setItem('privateKey', keys.privateKey);
                
                const pem = await AsyncStorage.getItem('authcsr');
                
                if(!pem){
                    const csr = makeCSR(keys.publicKey, keys.privateKey, username);
                    try{await AsyncStorage.setItem('authcsr', csr);}
                    catch(err){
                        console.log(err);
                    }
                }
           }
           catch(err){
               dispatch({ type: 'add_error', payload: 'Problem generating keys'});
               console.log(err);
           }

            //move to main flow(account page, landing page, etc)
            navigate('mainFlow');
        }
        catch (err) {
            dispatch({ type: 'add_error', payload: 'Incorrect username or password'});
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
                await AsyncStorage.removeItem('authcsr');
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
    { signup, signin, signout, clearErrorMessage, tryLocalSignIn },
    { token:null, errorMessage:'', publicKey:null, privateKey:null }
);