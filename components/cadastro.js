import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './src/service/firebase';
import { AppContext } from "./src/context/AppContext";
import MyModal from "./myModal";
import { useTranslation } from 'react-i18next';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState("WAREHOUSEOPERATOR");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [navigationPage, setNavigationPage] = useState("");

  const { URL } = useContext(AppContext);
  const { t } = useTranslation();

  // Função de chamada à API com logs de depuração
  const usersApp = async (data) => {
    try {
      console.log('[usersApp] POST ->', `${URL}/api/usersApp`, 'payload:', data);
      const response = await fetch(`${URL}/api/usersApp`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const status = response.status;
      const text = await response.text();
      console.log('[usersApp] status:', status, 'body text:', text);

      if (!response.ok) {
        let msg = `Falha ao inserir os dados (status ${status})`;
        try {
          const errJson = text ? JSON.parse(text) : null;
          if (errJson && errJson.message) msg = errJson.message;
        } catch (e) {
          // texto não-json
          msg = text || msg;
        }
        throw new Error(msg);
      }

      if (!text) throw new Error("O servidor não retornou confirmação do cadastro.");

      let res;
      try {
        res = JSON.parse(text);
      } catch (e) {
        throw new Error("Resposta da API inválida (não é JSON): " + text);
      }

      return res;
    } catch (err) {
      console.error('[usersApp] erro:', err);
      throw err;
    }
  };

  const handlerRegister = async () => {
    try {
      const data = { name, email, permissions };
      console.log('[handlerRegister] enviando para API ->', data);
      const result = await usersApp(data);
      console.log('[handlerRegister] resultado da API ->', result);
      setResponse(result);
      setError(null);

      return (result && (result.success || result.id || result._id)) ? true : false;
    } catch (err) {
      console.error('[handlerRegister] erro:', err);
      setError(err.message || JSON.stringify(err));
      return false;
    }
  };

  const sample = async () => {
    if (!name) {
      setModalTitle('Erro');
      setModalMsg('Campo nome vazio para operação em lote. Use o formato: email1,Nome1-email2,Nome2');
      setModalVisible(true);
      return;
    }

    const usersList = name.split("-").map(s => s.trim()).filter(Boolean);

    users = []
    usersList.map((user) => {
      userVetor = user.split(",")
      userNew = {}
      userNew.nome = userVetor[1]
      userNew.email = userVetor[0]
      userNew.senha = "1234567"
      
      users.push(userNew)

      //console.log(userNew)
    })

    for (const user of users) {
      try {
        console.log('[sample] criando no firebase ->', user.email);
        const res = await createUserWithEmailAndPassword(auth, user.email, user.senha);
        console.log('[sample] firebase res ->', res);
        if (res && res.user) {
          await usersApp({ name: user.nome, email: user.email, password: user.senha, permissions: 'WAREHOUSEOPERATOR' });
          console.log('[sample] cadastrado no backend ->', user.email);
        } else {
          console.warn('[sample] createUserWithEmailAndPassword não retornou res.user para', user.email, res);
        }
      } catch (err) {
        console.error('[sample] erro ao criar usuário', user.email, err);
      }
    }
  };

  async function createUser() {
    if (!name) {
      setModalTitle(t("erro Usuario"));
      setModalMsg(t("informe nome de usuario"));
      setModalVisible(true);
      return;
    }

    if (!email) {
      setModalTitle(t("erro email"));
      setModalMsg(t("informe um email"));
      setModalVisible(true);
      return;
    }

    if (!password || password.length < 6) {
      setModalTitle(t("erro senha"));
      setModalMsg(t("A senha deve ter pelo menos 6 caracteres."));
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('[createUser] criando no firebase ->', email);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[createUser] firebase res ->', res);

      if (res && res.user) {
        const ok = await handlerRegister();
        setIsLoading(false);

        setModalTitle(t("sucesso"));
        setModalMsg(ok ? t("usuario cadastrado com sucesso") : t("usuario criado no Firebase, mas não cadastrado no sistema"));
        setNavigationPage("Login");
        setModalVisible(true);
      } else {
        // Caso raro: firebase não retornou user
        setIsLoading(false);
        setModalTitle('Erro');
        const msg = 'Firebase criou a conta mas não retornou dados de usuário (res.user undefined).';
        console.error('[createUser] ' + msg, res);
        setModalMsg(msg);
        setModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      setModalTitle('Erro');
      console.error('[createUser] catch ->', error);

      // Mostra mensagem detalhada para debug (mensagem de erro do Firebase)
      const code = error?.code;
      const message = error?.message || String(error);

      switch (code) {
        case 'auth/email-already-in-use':
          setModalMsg(t("este e-mail ja esta em uso. tente outro e-mail.") + ` (${message})`);
          break;
        case 'auth/invalid-email':
          setModalMsg(t("O e-mail fornecido é inválido.") + ` (${message})`);
          break;
        case 'auth/weak-password':
          setModalMsg(t("A senha deve ter pelo menos 6 caracteres.") + ` (${message})`);
          break;
        default:
          setModalMsg((t("Não foi possível realizar o cadastro. Tente novamente.") + ` (${message})`).slice(0, 1000));
          break;
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
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#313131"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder={t("senha")}
          placeholderTextColor="#313131"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={createUser} style={styles.button} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size={45} color="#fff" /> :
              <Text style={styles.btnText}>{t("cadastra")}</Text>
            }
          </Pressable>

          <Pressable onPress={sample} style={styles.button} disabled={isLoading}>
            <Text style={styles.btnText}>{t("cad.lote")}</Text>
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
      />
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
  },
  input: {
    width: "80%",
    height: 50,
    fontSize: 20,
    borderColor: "black",
    borderWidth: 1,
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
    borderRadius: 10,
    margin: 7,
    paddingHorizontal: 14,
  },
  btnText: {
    fontSize: 20,
    color: 'white',
    fontWeight: "900",
    padding: 13
  },
  box: {
    width: 400,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    height: 600,
  }
});
