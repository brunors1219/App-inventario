import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

const MyModal = ({ modalVisible, 
                    setModalVisible, 
                    modalTitle, 
                    modalMsg, 
                    modalType,
                    setIsLoading, 
                    navigation, 
                    navigationPage }) => {

    const { t } = useTranslation();

    const hideMessage = () => {
        setModalVisible(false);
        setIsLoading ? setIsLoading(false) : null;

        if (navigationPage && navigationPage !== "") {
            navigation.navigate(navigationPage);
        }
    };

    const backgroundColor =
        modalType === "alert"
            ? styles.modalContentAlert
            : modalType === "error"
                ? styles.modalContentError
                : styles.modalContentSuccess

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={hideMessage}
        >
            <BlurView intensity={150} style={StyleSheet.absoluteFill}>
                <View style={styles.modalContainer }>
                    <View style={[styles.modalContent]}>
                        <Text style={[styles.title, backgroundColor]}>{modalTitle}</Text>
                        <Text style={styles.message}>{modalMsg}</Text>
                        <Pressable onPress={hideMessage}
                            style={[styles.buttonReg, backgroundColor]}>
                            <Text style={styles.buttonText}>{t("fechar")}</Text>
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '80%',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 10,
    },
    modalContentError: {
        backgroundColor: 'red'
    },
    modalContentSuccess: {
        backgroundColor: 'yellowgreen'
    },
    modalContentAlert: {
        backgroundColor: 'yellow'
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    message: {
        margin: 5,
        fontSize: 18,
        color: 'green'
    },
    buttonReg: {
        backgroundColor: '#76bc21',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10,
        width: '50%',
        margin: 15
    },

    title: {
        fontWeight: "bold",
        fontSize: 20,
        backgroundColor: 'green',
        color: 'white',
        width: '100%',
        textAlign: 'center',
        height: 50,
        alignItems: 'center',
        borderTopLeftRadius: 10,  // Arredonda o canto superior esquerdo
        borderTopRightRadius: 10, // Arredonda o canto superior direito
        textAlignVertical: 'center'
    },

    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: "900",
        padding: 15
    }

});

export default MyModal;