import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image, Modal, TextInput, Alert, Button, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Welcome({ navigation }){

    const [lastPress, setLastPress] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [newUserVisible, setNewUserVisible] = useState(false);

    const { t } = useTranslation();

    const handleDoubleClick = () => {
      const time = new Date().getTime();
      const delta = time - lastPress;

      if (delta < 300) {
        setPassword("")
        setIsModalVisible(true);  // Exibe o modal para digitar a senha
      }
      setLastPress(time);
    };

    const handlePasswordSubmit = () => {
      // Lógica para validar ou usar a senha digitada
      setNewUserVisible(password === "A9248D")
      setIsModalVisible(false)
    };

    const handleLoginPress = () =>{
        navigation.navigate('Login');
    };
    const handleCadastraPress = () =>{
      navigation.navigate('Cadastro');
  };
  return(
    <View style={styles.container}>
       <TouchableOpacity onPress={handleDoubleClick}>
          <Image source={require('../assets/data_access.png')}  style={{width:350, height:350}}/>
       </TouchableOpacity>
      <Text style={styles.title}>{t("welcome")}</Text>
      <View style={styles.conbutton}>
        <Pressable onPress={handleLoginPress} style={styles.loginbutton}>
          <Text style={styles.logintext}>{t("login")}</Text>
        </Pressable>
        <View style={{width:'70%'}}>
          <Text style={{textAlign:'center', color:'#a9a9a9'}}>
            {t("instructionMsgToEnter")}            
          </Text>
        </View>

        {newUserVisible
          ? <View style={{marginTop:30, alignItems:'center'}}>          
              <Pressable onPress={handleCadastraPress} style={styles.loginbutton}>
                <Text style={styles.logintext}>t("btnRegistrar")</Text>
              </Pressable>
              <View style={{width:'50%'}}>
                <Text style={{textAlign:'center', color:'#a9a9a9'}}>
                  Para o primeiro acesso faça seu Cadastro.
                </Text>
              </View>          
            </View>
          : null
        }

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TextInput
                type={'custom'}
                options={{
                  mask: '****'  // Define uma máscara para que só aceite 4 caracteres
                }}
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder="Digite sua senha"
                secureTextEntry
                style={styles.input}
              />
              <Button title="Confirmar" onPress={handlePasswordSubmit} />
            </View>
          </View>
        </Modal>

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