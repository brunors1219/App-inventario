import { React, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, Alert, Image, Pressable } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./src/service/firebase"; // Importa o auth do Firebase configurado
import { AppContext } from "./src/context/AppContext";
import { ENVIROMENT, USER_DEFAULT, PWD_DEFAUT } from '@env';
import MyModal from "./myModal";


export default function Login({ navigation }) {
  const [email, setEmail] = useState(ENVIROMENT === 'DEV' ? USER_DEFAULT : "");
  const [password, setPassword] = useState(ENVIROMENT === 'DEV' ? PWD_DEFAUT : "");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId, userId, setUserProfile, URL } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");

  async function handleLogin() {
    if (!email) {
      setModalTitle('Erro Email');
      setModalVisible(true)
      setModalMsg("Informe um email!")
      setIsLoading(false);
      return
    }

    if (!password) {
      setModalTitle('Erro Senha');
      setModalVisible(true)
      setModalMsg("Informe uma senha de 6 números!")
      setIsLoading(false);
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setIsLoading(true);

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
        setIsLoading(false);
      };

      console.log("Login realizado com sucesso! ID: " + user.uid + " Banco ID: " + userId);
      setIsLoading(false);
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
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={45} color="#fff" />
          ) : (
            <Text style={{
              fontSize: 20,
              color: 'white',
              fontWeight: 900,
              padding: 15
            }}>Acessar</Text>
          )}
        </Pressable>
        <Text style={styles.link} onPress={() => navigation.navigate('Resert_password')}>Esqueceu a senha</Text>
      </View>
      <MyModal
        modalVisible={modalVisible}
        modalTitle={modalTitle}
        modalMsg={modalMsg}
        setModalVisible={setModalVisible}
      >
      </MyModal>
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
    color: "green",
    fontStyle: "bold"
  },

  button: {
    backgroundColor: '#76bc21',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 10,
    margin: 15
  }
});