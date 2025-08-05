import { React, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { View, TextInput, Pressable, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import MyModal from "./myModal";

import { useTranslation } from 'react-i18next';

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    const { t } = useTranslation();
    
    async function resetPassword(email) {
        const auth = getAuth();
    
    
        try {
            await sendPasswordResetEmail(auth, email);
            setIsLoading(true);
            console.log("E-mail de redefinição de senha enviado com sucesso.");
            setModalTitle(t('Sucesso'));
            setModalVisible(true)
            setModalMsg(t("Um e-mail de redefinição de senha foi enviado para o endereço informado."))
            
    
        } catch (error) {
            console.error("Erro ao enviar e-mail de redefinição de senha:", error);
            switch (error.code) {
                case 'auth/user-not-found':
                    alert("Usuário não encontrado.");
                    
                    break;
                case 'auth/invalid-email':
                    alert("O e-mail fornecido é inválido.");
                    break;
                default:
                    alert("Ocorreu um erro. Tente novamente.");
            }
        }
    }


    const handleResetPassword = () => {
        setIsLoading(true);
        if (!email) {
            setModalTitle(t('Erro Email'));
            setModalVisible(true)
            setModalMsg(t("Por favor, insira um endereço de email"))
            setIsLoading(false);
            return
        } else {
            setIsLoading(false);
            resetPassword(email);
            navigation.navigate("Login");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Image source={require('../assets/logo.png')} style={styles.image} />
                <Text style={styles.title}>{t("Digite email para redefinição da senha")} </Text>
                <TextInput
                    placeholder={t("digite seu email")}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <Pressable onPress={handleResetPassword}
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
                        }}>{t("enviar")}</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
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

    image: {
        width: 150,
        height: 150,
    },

    title: {
        fontSize: 17,
        margin: 10,

    },
    button: {
        backgroundColor: '#76bc21',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10,
        margin: 15
    }

})