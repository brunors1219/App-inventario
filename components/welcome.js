import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

export default function Welcome({ navigation }){

    const handleLoginPress = () =>{
        navigation.navigate('Login');
    };
    const handleCadastraPress = () =>{
      navigation.navigate('Cadastro');
  };
  return(
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo </Text>
      <Text style={styles.text}>Este é um aplicativo de inventário com login obrigatório permite que os usuários acessem e gerenciem inventários de forma segura e organizada.
        Caso não tenha cadatro vai em "Registrar".
      </Text>
      <View style={styles.conbutton}>
        <Pressable onPress={handleLoginPress} style={styles.loginbutton}>
          <Text style={styles.logintext}>Login ➡️</Text>
        </Pressable>
        <Pressable onPress={handleCadastraPress} style={styles.loginbutton}>
          <Text style={styles.logintext}>Registrar ✅</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    padding:20

  },
  title:{
    fontSize:30,
    color:'white',
    fontStyle:'bold',
    marginBottom: 10,
    textAlign:'left'
  },
  text:{
    fontSize:20,
    color:'white',
    marginBottom:20,
    width:'95%',
    textAlign:'left'
  },
  conbutton:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:10
  },
  loginbutton:{
    alignItems:'center',
    alignContent:'center',
    paddingHorizontal:10,
    paddingVertical:10,
    backgroundColor:'#D9D9D9',
    width:200,
    marginBottom:5,
    borderRadius:5
  },
  logintext:{
    fontSize:20,
    textAlign:'center'
  },


})