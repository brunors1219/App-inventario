import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './src/service/firebase';
import { AppContext } from "./src/context/AppContext";
import MyModal from "./myModal";


export default function Cadastro({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");




  const { URL } = useContext(AppContext)

  const usersApp = async (data) => {
    try {
      const response = await fetch(`${URL}/api/usersApp`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        //make sure to serialize your JSON body
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Falha ao inserir os dados');
      }

      const res = await response.json();
      return res;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }

  };

  const handlerRegister = async () => {
    try {
      const data = { name, email, 'permissions': 'WAREHOUSEOPERATOR' };
      const result = await usersApp(data);
      setResponse(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }


  async function createUser() {

    if (!name) {
      setModalTitle('Erro Usuario');
      setModalVisible(true)
      setModalMsg("Informe nome de usuário!")
      setIsLoading(false);
      return
    }

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


    setIsLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (res) {
        handlerRegister();
        setIsLoading(false);
        console.log('Cadastrado com sucesso! \n ' + res.user.uid);
        setModalTitle('Sucesso');
        setModalMsg("Usuário cadastrado com sucesso!");
        setModalVisible(true);
        navigation.navigate("Login");
      }
    } catch (error) {
      setIsLoading(false);
      setModalTitle('Erro');

      if (error.code === 'auth/email-already-in-use') {
        setModalMsg("Este e-mail já está em uso. Tente outro e-mail.");
      } else {
        setModalMsg("Não foi possível realizar o cadastro. Tente novamente.");
      }

      setModalVisible(true);
    }




  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={require('../assets/logo.png')} style={styles.image} />
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#313131"
          value={name}
          onChangeText={value => setName(value)}
          style={styles.input} />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#313131"
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.input} />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#313131"
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.input} />

        <Pressable onPress={() => createUser()}
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
              fontWeight: "900",
              padding: 15
            }}>Cadastrar</Text>
          )}
        </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',

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
    width: 120,
    height: 120,
  },

  button: {
    backgroundColor: '#76bc21',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 10,
    margin: 15
  },

  buttonPressed: {
    opacity: 0.7,
  },

  box: {
    width: 350,
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
    height: 500,
  }
})