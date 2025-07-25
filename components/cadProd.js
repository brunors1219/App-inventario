import { React, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Button, ScrollView } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from 'react-i18next';

export default function Cadprod() {


    const [id, setId] = useState("");
    const [quant, setQuant] = useState("");
    const [pos, setPos] = useState("");

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
    const { t } = useTranslation();
    
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
            await addDoc(collection(db, "produto"), {
                id: id,
                quantidade: quant,
                posicao: pos,
                date: date
            });
            console.log("Produto cadastrado com sucesso!");

            // Limpa os campos
            setId('');
            setQuant('');
            setPos('');
            setDate('');
        } catch (e) {
            console.error("Erro ao cadastrar o produto: ", e);
        }
    };

    return (

        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.text}>{t("cadastroproduto")}</Text>
                </View>
                <Text style={styles.label}>{t("codigoproduto")} </Text>
                <TextInput placeholder="Digite código" style={styles.input} value={id} onChangeText={setId}
                />
                <Text style={styles.label}>{t("posicao")}</Text>
                <TextInput placeholder="Digite posição" style={styles.input}
                    value={pos}
                    onChangeText={setPos} />
                <Text style={styles.label}>{t("quantidade")} </Text>
                <TextInput placeholder="Digite quantidade" style={styles.input}
                    value={quant}
                    onChangeText={setQuant} />
                
                {/* <View>
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
                        Data selecionada: {date ? date.toLocaleDateString(): 'Nenhuma data selecionada'}
                    </Text>
                </View> */}
                <Pressable onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>{t("enviar")}</Text>
                </Pressable>
            </View>


        </ScrollView>
    )
}

styles = StyleSheet.create({
    
    scroll:{
        flex: 1,
        backgroundColor: "#FFF"
    },
    container: {
        flex: 1,
        padding: 20,
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
        borderRadius: 5,
        fontSize: 15,
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
        marginBottom: 20,
    }
});