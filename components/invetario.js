import { React, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, Button } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function Inventario() {

    const [nomeus, setNomeus] = useState("");
    const [cod, setCod] = useState("");
    const [quant, setQuant] = useState("");
    const [pos, setPos] = useState("");
    const [datahora, setData] = useState("");
    const [numbercontacao, setNumbercontacao] = useState("");

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {

        if (event.type === "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        }
        setShow(false);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

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

                <Text style={styles.label}>Numero Cont.: </Text>
                <TextInput placeholder="Digite número de contagem:" style={styles.input}
                    value={numbercontacao}
                    onChangeText={setNumbercontacao}
                    keyboardType="numeric" />


                <Text style={styles.label}>Data: </Text>

                <View>
                    <Button onPress={showDatepicker} title="Escolher Data" />
                </View>

                {
                    show && (
                        <DateTimePicker
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )
                }

                <Text style={{ marginVertical: 20, fontSize: 18 }}>
                    Data selecionada: {date ? date.toLocaleDateString() : 'Nenhuma data selecionada'}
                </Text>
            </View>




            <Pressable onPress={handleRegister} style={styles.button}>
                <Text style={styles.text}>Enviar</Text>
            </Pressable>

        
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

    }
});