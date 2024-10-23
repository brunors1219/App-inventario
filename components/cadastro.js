import React, { useState } from "react";
import {View, Text, Button , StyleSheet, TextInput, Image}  from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from './src/service/firebase'


export default function Cadastro({ navigation }){


const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

    async function createUser() {
        await createUserWithEmailAndPassword(auth, email, password)
        .then(value => {
            console.log('cadastrado com sucesso! \n ' + value.user.uid )
            navigation.navigate("Welcome");
        })
        .catch(erro => console.log(erro));
    };

    return(
        <View style= {styles.container}>
            <View style={styles.box}>
                <Image source={require('../assets/adaptive-icon.png')} style={styles.image}/>
                <Text style={styles.title}>Cadastro</Text>
                <TextInput
                placeholder="Email"
                placeholderTextColor="#313131"
                value={email}
                onChangeText={value=>setEmail(value)}
                style={styles.input}/>
                <TextInput
                placeholder="Senha"
                placeholderTextColor="#313131"
                value={password}
                onChangeText={value=>setPassword(value)}
                style={styles.input}/>
                <Button
                title="Cadastrar"
                onPress={() => createUser()}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',

    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      },
      title: {
        fontSize: 24,
        marginBottom: 20,
      },
      input: {
        width: "80%",
        height: 50,
        fontSize:20,
        boderColor: "black",
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
      },
      image:{
        width:120,
        height:120,
      },
      box:{
        width:350,
        justifyContent:'center',
        alignItems:"center",
        backgroundColor: '#fff', // Cor de fundo do container
        borderRadius: 20, // Bordas arredondadas
        padding: 20, // Espaçamento interno
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25, // Opacidade da sombra
        shadowRadius: 3.84, // Raio da sombra
        elevation: 5, // Elevação (necessário para Android)
        height: 500, 
      }
})