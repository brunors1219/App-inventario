import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';

export default function Welcome({ navigation }){

    const handleLoginPress = () =>{
        navigation.navigate('Login');
    };
    const handleCadastraPress = () =>{
      navigation.navigate('Cadastro');
  };
  return(
    <View style={styles.container}>
      <Image source={require('../assets/data_access.png')} style={{width:350, height:350}}/>
      <Text style={styles.title}>Bem vindo </Text>
      <View style={styles.conbutton}>
        <Pressable onPress={handleLoginPress} style={styles.loginbutton}>
          <Text style={styles.logintext}>Login</Text>
        </Pressable>
        <View style={{width:'70%'}}>
          <Text style={{textAlign:'center', color:'#a9a9a9'}}>
            Para acessar o sistema, você precisará de seu e-mail e senha
          </Text>
        </View>

        <View style={{marginTop:30, alignItems:'center'}}>
          
          <Pressable onPress={handleCadastraPress} style={styles.loginbutton}>
            <Text style={styles.logintext}>Registrar</Text>
          </Pressable>
          <View style={{width:'50%'}}>
            <Text style={{textAlign:'center', color:'#a9a9a9'}}>
              Para o primeiro acesso faça seu Cadastro.
            </Text>
          </View>          
        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize:30,
    // color:'white',
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
    backgroundColor:'#76bc21',
    width:200,
    marginBottom:5,
    borderRadius:5,
    color: 'white'
  },
  logintext:{
    color:'white',
    fontSize:20,
    fontWeight:'600',
    textAlign:'center'
  },


})