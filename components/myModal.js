import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

const MyModal = ({ modalVisible, setModalVisible, modalTitle, modalMsg, setIsLoading }) => {

    const hideMessage = () => {
        setModalVisible(false);
        setIsLoading(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={hideMessage}
        >
            <BlurView intensity={150} style={StyleSheet.absoluteFill}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>{modalTitle}</Text>
                        <Text style={styles.message}>{modalMsg}</Text>
                        <Pressable onPress={hideMessage}
                            style={styles.buttonReg}>
                            <Text style={styles.buttonText}>Fechar</Text>
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