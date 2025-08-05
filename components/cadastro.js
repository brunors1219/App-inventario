import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './src/service/firebase';
import { AppContext } from "./src/context/AppContext";
import MyModal from "./myModal";
import { useTranslation } from 'react-i18next';

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

  const [navigationPage, setNavigationPage] = useState("");

  const { URL } = useContext(AppContext)

  const { t } = useTranslation();
  
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

  const sample = async () => {

    let usersList = name
    usersList = usersList.split("-")

    users = []
    usersList.map((user) => {
      userVetor = user.split(",")
      userNew = {}
      userNew.nome = userVetor[1]
      userNew.email = userVetor[0]
      userNew.senha = "1234567"
      users.push(userNew)
    })

    users.map(async (user) => {
      try {
        const res = await createUserWithEmailAndPassword(auth, user.email, user.senha);

        if (res) {
          const data = { name: user.nome, email: user.email, 'permissions': 'WAREHOUSEOPERATOR' };
          const result = await usersApp(data);
        }
      } catch (error) {
        console.log(error.message)
      }
    })

  }
  async function createUser() {

    if (!name) {
      setModalTitle(t("erro Usuario"));
      setModalVisible(true)
      setModalMsg(t("informe nome de usuario"))
      setIsLoading(false);
      return
    }

    if (!email) {
      setModalTitle(t('erro email'));
      setModalVisible(true)
      setModalMsg(t("informe um email"))
      setIsLoading(false);
      return
    }

    if (!password) {
      setModalTitle(t('erro senha'));
      setModalVisible(true)
      setModalMsg(t("informe uma senha de 6 numeros"))
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
        setModalTitle(t("sucesso"));
        setModalMsg(t("usuario cadastrado com sucesso"));
        setNavigationPage("Login");
        setModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      setModalTitle('Erro');

      //se email estiver existente 
        
      if (error.code === 'auth/email-already-in-use') {
        setModalMsg(t("este e-mail ja esta em uso. tente outro e-mail."));
      
      } else if (error.code === 'auth/invalid-email') {
        setModalMsg(t("O e-mail fornecido é inválido. Por favor, insira um e-mail válido."));
        console.log(error.code )
      }else if(error.code === 'auth/weak-password') {
        setModalMsg(t("A senha deve ter pelo menos 6 caracteres."));
      } else {
        setModalMsg(t("Não foi possível realizar o cadastro. Tente novamente."));
      }
      setModalVisible(true);
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={require('../assets/logo.png')} style={styles.image} />
        <Text style={styles.title}>{t("cadastro")}</Text>
        <TextInput
          placeholder={t("usuario")}
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
          placeholder={t("senha")}
          placeholderTextColor="#313131"
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.input} />

        <View style={{ display: 'flex', flexDirection: 'row' }}>
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
              }}>{t("cadastra")}</Text>
            )}
          </Pressable>

          <Pressable onPress={() => sample()}
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
              }}>{t("cad.lote")}</Text>
            )}
          </Pressable>


        </View>

      </View>
      <MyModal
        modalVisible={modalVisible}
        modalTitle={modalTitle}
        modalMsg={modalMsg}
        setModalVisible={setModalVisible}
        navigation={navigation}
        navigationPage={navigationPage}
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