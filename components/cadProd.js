import { React, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";

export default function Cadprod() {


    const [id, setId] = useState("");
    const [quant, setQuant] = useState("");
    const [pos, setPos] = useState("");
    

    const handleRegister = async () => {
        try {
            // Adiciona o documento ao Firestore
            await addDoc(collection(db, "produto"), {
                id: id,
                quantidade: quant,
                posicao: pos
            });
            console.log("Produto cadastrado com sucesso!");
            
            // Limpa os campos
            setId('');
            setQuant('');
            setPos('');
        } catch (e) {
            console.error("Erro ao cadastrar o produto: ", e);
        }
    };




    return (

        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.text}>Cadastro de Produto</Text>
            </View>



            <Text style={styles.label}>Código do produto: </Text>
            <TextInput placeholder="Digite código" style={styles.input} value={id} onChangeText={setId}
            />



            <Text style={styles.label}>Quantidade: </Text>
            <TextInput placeholder="Digite quantidade" style={styles.input}
                value={quant}
                onChangeText={setQuant} />


            <Text style={styles.label}>Posição: </Text>
            <TextInput placeholder="Digite posição" style={styles.input}
                value={pos}
                onChangeText={setPos} />

            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={styles.text}>Enviar</Text>
            </TouchableOpacity>

        </View>
    )
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },

    text: {
        fontSize: 25,
        color: 'white',
        padding: 15
    },

    label: {
        fontSize: 16,
        marginBottom: 15,
        color: '#333'
    },
    input: {
        boderColor: "black",
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5

    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        marginBottom: 20,
        shadowColor: 'black',
        borderRadius: 5
    },
    button:{
        backgroundColor:'gray',
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        borderRadius:10,
        
    }
});