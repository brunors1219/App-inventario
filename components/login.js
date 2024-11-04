import { React, useState, useContext } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert, Image, Pressable } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./src/service/firebase"; // Importa o auth do Firebase configurado
import { AppContext } from "./src/context/AppContext";
import { ENVIROMENT, USER_DEFAULT, PWD_DEFAUT } from '@env';


export default function Login({ navigation }) {
  const [email, setEmail] = useState(ENVIROMENT === 'DEV' ? USER_DEFAULT : "");
  const [password, setPassword] = useState(ENVIROMENT === 'DEV' ? PWD_DEFAUT : "");

  const { setUserId, userId, setUserProfile, URL } = useContext(AppContext)

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
        console.log(data)
        setUserId(data[0].id);
        setUserProfile(data[0].permissions)
      } catch (error) {
        setUserId('');
        console.error("Erro ao buscar dados:", error);
      } finally {

      };

      console.log("Login realizado com sucesso! ID: " + user.uid + " Banco ID: " + userId);

      navigation.navigate("Inventário");

    } catch (error) {
      console.log(error);
      Alert.alert("Erro de login", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={require('../assets/logo.png')} style={styles.image} />
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

        <Pressable onPress={handleLogin}
          style={{
            backgroundColor: '#76bc21',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            borderRadius: 10,
            margin: 15
          }}>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: 900,
            padding: 15
          }}>Acessar</Text>
        </Pressable>
        <Text style={styles.link} onPress={() => navigation.navigate('Resert_password')}>Esqueceu a senha</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontStyle: 'bold'
  },
  input: {
    width: "80%",
    height: 50,
    fontSize: 20,
    boderColor: "black",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  box: {
    width: '90%',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#fff', // Cor de fundo do container
    borderRadius: 20, // Bordas arredondadas
    padding: 20, // Espaçamento interno
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação (necessário para Android)
    height: '90%',
  },
  link: {
    fontSize: 17,
    textDecorationLine: "underline",
    color:"green",
    fontStyle:"bold"


  }
});