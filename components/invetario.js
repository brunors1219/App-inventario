import { React, useState, useContext } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, Button } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppContext } from "./src/context/AppContext";


export default function Inventario({navigation}) {

    const { item } = useContext(AppContext)

    console.log(item)

    const [position, setPositon] = useState(item.Position)
    const [pn, setPN] = useState(item.PN)
    const [description, setDescription] = useState(item.Description)
    const [qty, setQty] = useState()
    
    const handleRegister = async () => {
        try {
            // Adiciona o documento ao Firestore
            await addDoc(collection(db, "Inventario"), {
                cod: cod,
                nomeus: nomeus,
                numbercontacao: numbercontacao,
                quantidade: quant,
                posicao: pos,
                date: date
            });
            console.log("Produto cadastrado com sucesso!");

            // Limpa os campos
            setCod('');
            setQuant('');
            setPos('');
            setNumbercontacao('');
            setNomeus('');
            setDate('');

        } catch (e) {
            console.error("Erro ao cadastrar o produto: ", e);
        }
    };




    return (

        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.text}>Cadastrado/Edição</Text>
                </View>
                
                <Text style={styles.label}>PN: </Text>
                <TextInput placeholder="PN" style={styles.input} value={pn}
                    onChangeText={setPN}
                    keyboardType="numeric"
                />
          

                <Text style={styles.label}>Descrição: </Text>
                <TextInput placeholder="Descrição" style={styles.input}
                    value={description}
                    onChangeText={setDescription} />

                <Text style={styles.label}>Posição: </Text>
                <TextInput placeholder="Posicao" style={styles.input}
                    value={position}
                    onChangeText={setPositon}
                     />
                
                <Text style={styles.label}>Quantidade</Text>
                <TextInput placeholder="Quantidade" 
                    value={qty}
                    onChangeText={setQty} />
            </View>

            <View>
                <Pressable onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>Registrar</Text>
                </Pressable>
                <Pressable onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>Cancelar</Text>
                </Pressable>
            </View>
        
        </ScrollView >
    )
}

styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    container: {
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
        margin:15,
        

    }
});