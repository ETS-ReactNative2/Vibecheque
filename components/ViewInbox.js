import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    state = {
        accessToken: ''
    }

    getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }
    
    handlePressAnywhere = () => {
        let imageId = this.props.reduxState.inbox[0].id;
        let senderId = this.props.reduxState.inbox[0].from_users_id;
        // delete viewed image from database
        fetch('http://10.100.100.84:5000/images', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            },
            body: JSON.stringify({
                "imageId": imageId
            })
        })
        console.log('before redux delete:', this.props.reduxState.inbox)
        // delete viewed image from redux
        
        console.log('after redux delete:', this.props.reduxState.inbox)
        
        //if the recieved image is not a response, prepare for responding by dispatching to redux
        console.log('this.props.reduxState.inbox[0].is_response:', this.props.reduxState.inbox[0].is_response)
        if (!this.props.reduxState.inbox[0].is_response) {
            this.props.dispatch({                 //still need to test if this works
                type: 'SET_RESPONDING',
                payload: { senderId: senderId }
            })
        }
        
        console.log('senderId:', this.props.reduxState.senderId)

        this.props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE'
        })
        this.props.history.push('/camera')
    }

    report = () => {
        console.log('in report')
        fetch(`http://10.100.100.84:5000/users/${this.props.reduxState.inbox[0].from_users_id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }  
        })
    }

    favorite = async () => {
        console.log('in favorite')
        // send image url to database and replace existing
        await fetch('http://10.100.100.84:5000/users', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            },
            body: JSON.stringify({
                "image_url": this.props.reduxState.inbox[0].image_url
            })
        }).then((response) => {
            console.log('in favorite .then')
        })
    }

    async componentDidMount() {
        console.log('in ViewInbox componentDidMount')
        await this.getToken()
            .then(response => {
                //console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
        console.log('state access token:', this.state.accessToken)
        console.log('reduxState.inbox:', this.props.reduxState.inbox)
    }
    
    render() {
        return (
            <>
                <View style={{ flex: 1, margin: 0 }}>
                    <TouchableWithoutFeedback onPress={() => this.handlePressAnywhere()}>

                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.reduxState.inbox[0].image_url }}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: '#CC375E',
                                    width: 47,
                                    height: 47,
                                    borderWidth: 3,
                                    borderColor: 'black',
                                    borderRadius: 10                   
                                }}
                                onPress={() => this.report()}>
                                <FontAwesome
                                    name='thumbs-down'
                                    style={{ color: 'black', fontSize: 40}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: '#9EE7FF',
                                    width: 47,
                                    height: 47,
                                    borderWidth: 3,
                                    borderColor: 'black',
                                    borderRadius: 10                        
                                }}
                                onPress={() => this.favorite()}>
                                <Ionicons
                                    name='md-star'
                                    style={{ color: 'white', fontSize: 40}}
                                />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    </TouchableWithoutFeedback>
                </View>
            </>
        )
    }
}
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);