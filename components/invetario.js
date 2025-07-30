import { React, useState, useContext } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, Button } from "react-native";
import { db } from './src/service/firebase'; // importar a configuração do firebase
import { collection, addDoc } from "firebase/firestore";
import { AppContext } from "./src/context/AppContext";
import { useTranslation } from 'react-i18next';

export default function Inventario({navigation}) {

    const { item } = useContext(AppContext)
    const [position, setPositon] = useState(item.Position)
    const [pn, setPN] = useState(item.PN)
    const [description, setDescription] = useState(item.Description)
    const [qty, setQty] = useState()

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const { t } = useTranslation();
    
    useEffect(() => {
        const getCameraPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getCameraPermissions();
      }, []);

    const handleBarcodeScanned = ({ type, data }) => {
        setScanned(true);
        setPN(data);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
        
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
                <View style={styles.container}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                        }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    {scanned && (
                        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
                    )}
                </View>

                <Text style={styles.label}>{t("descricao")} </Text>
                <TextInput placeholder={t("descricao")} style={styles.input}
                    value={description}
                    onChangeText={setDescription} />

                <Text style={styles.label}>{t("posicao")} </Text>
                <TextInput placeholder="Posicao" style={styles.input}
                    value={position}
                    onChangeText={setPositon}
                     />
                
                <Text style={styles.label}>{t("quantidade")}</Text>
                <TextInput
                    placeholder={t("quantidade")}
                    value={qty}
                    onChangeText={text => {
                        // Aceita ponto ou vírgula como separador decimal
                        const normalized = text.replace(',', '.');
                        // Permite apenas números e um ponto decimal
                        if (/^\d*\.?\d*$/.test(normalized)) {
                            setQty(normalized);
                        }
                    }}
                    keyboardType="decimal-pad"
                />
            </View>

            <View>
                <Pressable onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>{t("registra")}</Text>
                </Pressable>
                <Pressable onPress={handleRegister} style={styles.button}>
                    <Text style={styles.text}>{t('cancelar')}</Text>
                </Pressable>
            </View>
        
            CenteredModal

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