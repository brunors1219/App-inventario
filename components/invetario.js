import { React, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";


export default function Inventario() {

    const [nomeus, setNomeus] = useState("");
    const [cod, setCod] = useState("");
    const [quant, setQuant] = useState("");
    const [pos, setPos] = useState("");
    const [datahora, setData] = useState("");
    const [numbercontacao, setNumbercontacao] = useState("");


    const handleRegister = async () => {
        try {
            // Adiciona o documento ao Firestore
            await addDoc(collection(db, "Inventario"), {
                cod: cod,
                nomeus: nomeus,
                datahora: datahora,
                numbercontacao: numbercontacao,
                quantidade: quant,
                posicao: pos
            });
            console.log("Produto cadastrado com sucesso!");

            // Limpa os campos
            setCod('');
            setQuant('');
            setPos('');
            setData('');
            setNumbercontacao('');
            setNomeus('');

        } catch (e) {
            console.error("Erro ao cadastrar o produto: ", e);
        }
    };




    return (

        <ScrollView  style={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.text}>Inventario</Text>
                </View>
                <Text style={styles.label}>Código do produto: </Text>
                <TextInput placeholder="Digite código" style={styles.input} value={cod}
                onChangeText={setCod}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>Quantidade: </Text>
                <TextInput placeholder="Digite quantidade" style={styles.input}
                    value={quant}
                    onChangeText={setQuant}
                    keyboardType="numeric" />
                <Text style={styles.label}>Posição: </Text>
                <TextInput placeholder="Digite posição" style={styles.input}
                    value={pos}
                    onChangeText={setPos} />
                <Text style={styles.label}>Nome do usuario: </Text>
                <TextInput placeholder="Digite nome do usuario" style={styles.input}
                    value={nomeus}
                    onChangeText={setNomeus} />
                <Text style={styles.label}>Data: </Text>
                <TextInput placeholder="Digite Data" style={styles.input}
                    value={datahora}
                    onChangeText={setData}
                    keyboardType="numeric" />

                <Text style={styles.label}>Numero Cont.: </Text>
                <TextInput placeholder="Digite número de contagem:" style={styles.input}
                    value={numbercontacao}
                    onChangeText={setNumbercontacao}
                    keyboardType="numeric"/>


                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>Enviar</Text>
                </TouchableOpacity>
            
            </View>
        </ScrollView>
    )
}

styles = StyleSheet.create({
    scroll:{
        flex:1,
        backgroundColor:"#FFF"
    },
    container:{
        padding: 20,
        justifyContent: 'center',
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
    button: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10,

    }
});