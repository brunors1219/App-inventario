import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function Welcome({ navigation }){

    const handleLoginPress = () =>{
        navigation.navigate('Login');
    };
  return(
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo</Text>
      <Text style={styles.text}>Este é um aplicativo de inventário com login obrigatório permite que os usuários acessem e gerenciem inventários de forma segura e organizada.</Text>
      <View style={styles.conbutton}>
        <TouchableOpacity onPress={handleLoginPress} style={styles.loginbutton}>
          <Text style={styles.logintext}>Login ➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#447FFF',
    justifyContent: 'center',
    padding:'2rem'

  },
  title:{
    fontSize:'30px',
    fontStyle:'bold',
    marginBottom: '10px',
    textAlign:'left'
  },
  text:{
    fontSize:'15px',
    marginBottom:'20px',
    width:'80%',
    textAlign:'left'
  },
  conbutton:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:'1.25rem'
  },
  loginbutton:{
    alignItems:'center',
    alignContent:'center',
    paddingHorizontal:'10px',
    paddingVertical:'10px',
    backgroundColor:'#D9D9D9',
    width:'200px',
    borderRadius:5
  },
  logintext:{
    fontSize:'20px',
    textAlign:'center'
  },


})