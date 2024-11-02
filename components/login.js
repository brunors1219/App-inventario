import {React, useState, useContext} from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./src/service/firebase"; // Importa o auth do Firebase configurado
import { AppContext } from "./src/context/AppContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("ichihara7l@gmail.com");
  const [password, setPassword] = useState("123456");

  const { setUserId, userId, URL } = useContext(AppContext)

  async function handleLogin() {
    if (email === "" || password === "") {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        console.log(`${URL}/api/usersApp?email=${user.email}`)
        const res = await fetch(`${URL}/api/usersApp?email=${user.email}`)
        const data = await res.json()
        console.log(data[0].id)
        setUserId(data[0].id);
      } catch (error) {  
        setUserId('');      
        console.error("Erro ao buscar dados:", error);
      } finally {
        
      };
      
      console.log("Login realizado com sucesso! ID: " + user.uid + " Banco ID: " + userId);

      navigation.navigate("Main");
      
    } catch (error) {
      console.log(error);
      Alert.alert("Erro de login", error.message);
    }
  }

  return (
    <View style={styles.container}>
    <View style={styles.box}>
        <Image source={require('../assets/adaptive-icon.png')} style={styles.image}/>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#313131"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#313131"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // Oculta a senha enquanto o usuário digita
          />
          <Button title="Entrar" onPress={handleLogin} />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontStyle:'bold'
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
});