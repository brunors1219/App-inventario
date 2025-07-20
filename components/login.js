import { React, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TextInput, Image, Pressable } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./src/service/firebase"; // Importa o auth do Firebase configurado
import { AppContext } from "./src/context/AppContext";
import MyModal from "./myModal";
import { useTranslation } from 'react-i18next';

export default function Login({ navigation }) {

  const { setIdCompany, idCompany,
          setIdInventory, idInventory,
          setUserId, userId, 
          setUserProfile, 
          URL, 
          gENVIRONMENT, 
          gUSER_DEFAULT, 
          gPWD_DEFAUT } = useContext(AppContext);

  const [email, setEmail] = useState(gENVIRONMENT === 'DEV' ? gUSER_DEFAULT : "");
  const [password, setPassword] = useState(gENVIRONMENT === 'DEV' ? gPWD_DEFAUT : "");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");

  const { t } = useTranslation();

  async function handleLogin() {
    
    if (!email) {
      setModalTitle('Erro Email');
      setModalVisible(true)
      setModalMsg("Informe um email!")
    
      return
    }

    if (!password) {
      setModalTitle('Erro Senha');
      setModalVisible(true)
      setModalMsg("Informe uma senha de 6 números!")
      return
    }
    setIsLoading(true);
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

        if (data.length>1){
          //Here we need will implemented a new screen to user choige the company and inventory to operation
        }else{          
          setIdCompany(data[0].IdCompany)
          setIdInventory(data[0].IdInventory)
        }
      } catch (error) {
        setUserId('');
        console.error("Erro ao buscar dados:", error);
        return
      } finally {
        setIsLoading(false);
      };

      console.log(`Login realizado com sucesso! ID: ${user.uid} Banco ID: ${userId} Company: ${idCompany} Inventory: ${idInventory}`);
      
      navigation.navigate("Inventário");

    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/invalid-credential') {
        setModalTitle("Erro");
        setModalMsg("Credencial inválida. Por favor, verifique suas informações.");
        setModalVisible(true);
    
        
      } else {
        // Pode adicionar mais verificações ou mensagens de erro para outros códigos
        setModalMsg("Erro de autenticação. Tente novamente.");
        setModalVisible(true);
       
      }
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
          style={styles.button}
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