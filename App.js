import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import Login from './components/Login';
import Camera from './components/Camera';
import Favorite from './components/Favorite';
import Report from './components/Report';
import NewPicture from './components/NewPicture';
import Remove from './components/Remove';

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Taco!</Text>
        <Link to="/camera"><Text>Camera Link</Text></Link>
        <Route exact path="/" component={Login} />
        <Route path="/camera" component={Camera} />
        <Route path="/favorite" component={Favorite} />
        <Route path="/report" component={Report} />
        <Route path="/newpicture" component={NewPicture} />
        <Route path="/remove" component={Remove} /> 
      </View>
      
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
