import { React, useState, useContext, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, Button, Modal } from "react-native";
import { AppContext } from "./src/context/AppContext";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function InventarioS({ navigation }) {

    const [position, setPosition] = useState("")
    const [description, setDescription] = useState("")
    const [pn, setPN] = useState("")
    const [qty, setQty] = useState("")
    const [positions, setPositions] = useState("")
    const [pns, setPNs] = useState("")

    const { URL, user } = useContext(AppContext)

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");

    useEffect(() => {
        const fetchData = async () => {

            try {
                const res = await fetch(`${URL}/api/invproducts?selection=products`)
                const data = await res.json()
                setPNs(data)

                const result = [];
                data.forEach(item => {
                    // Adiciona a posição principal ao resultado
                    result.push(item.Position);

                    // Verifica se há posições auxiliares e as adiciona ao resultado
                    if (item.PositionAux) {
                        // Divide as posições auxiliares em um array e adiciona ao resultado
                        result.push(...item.PositionAux.split(','));
                    }
                })
                setPositions(result);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {

            };
        }
        fetchData();

    }, [])

    const register = async () => {

        if (!qty) {
            setModalVisible(true)
            setModalMsg("Informe uma Quantidade!")
            return
        }

        const body = {}

        body.PN = pn
        body.Position = position
        body.Qty = qty
        body.User_Id = 'teste'

        const res = await
            fetch(`${URL}/api/invproducts`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    //make sure to serialize your JSON body
                    body: JSON.stringify(body)
                });

        if (!res.ok) {
          setModalTitle('Alerta')
          setModalType('error')
        } else {
          setModalTitle('Informação')
          setModalType('success')
        }

        const data = await res.json();
        setModalVisible(true)
        
        setModalMsg(data.message)
        setQty('')
    }

    const handleBlurPosition = () => {
        // Verifica se a posição existe no vetor
        console.log('Position' + position.toUpperCase());
        console.log('Recover' + recoverCamera.toUpperCase());
        if (position === "" && recoverCamera == "") return;

        if (positions.includes(position.toUpperCase()) || positions.includes(recoverCamera.toUpperCase())) {

        }else {
            setModalTitle('Posição inválida');
            setModalMsg('A posição não existe no armazém.');
            setModalVisible(true);
            setPosition("");
        }

        recoverCamera = ""
    };

    const handleBlurPN = () => {
        if (pn === "" && recoverCamera == "") return;

        console.log('Position ' + position.toUpperCase());
        console.log('PN ' + pn.toUpperCase());
        console.log('Recover ' + recoverCamera.toUpperCase());

        // Verifica se a PN existe no cadastro
        _pn = pns.filter(f => f.PN == pn.toUpperCase() || f.PN == recoverCamera.toUpperCase())

        _pnExist = _pn.length > 0
        if (!_pnExist) {
            setModalTitle('PN inválido');
            setModalMsg('A PN não existe no cadastro. Acione o time de suporte!');
            setModalVisible(true);
            setPN("");
            return;
        }

        if (recoverCamera!="") {
            console.log('asdasd')
            _pnExistPosition = pns.filter(f => f.PN == recoverCamera.toUpperCase() && f.Position == position.toUpperCase()).length > 0
        } else {
            _pnExistPosition = pns.filter(f => f.PN == pn.toUpperCase() && f.Position == position.toUpperCase()).length > 0
        }
        
        recoverCamera = ""
        
        if (!_pnExistPosition) {
            setModalTitle('PN fora locação');
            setModalMsg('A PN existe, mas não é dessa possição. Atenção!');
            setModalVisible(true);
        }

        console.log(_pn);
        setDescription(_pn[0].Description)

    };

    const hideMessage = () => {
        setModalVisible(false);
    };

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);
    const [scannedShowPosition, setScannedShowPosition] = useState(false);

    let recoverCamera = ""

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
    
    const handleBarCodeScanned = ({ type, data }) => {
      setScannedData(data);
      setScannedShow(false);
      setPN(data);
      recoverCamera = data;
      handleBlurPN();
    };

    const handleBarCodeScannedPosition = ({ type, data }) => {
        setScannedData(data);
        setScannedShowPosition(false);
        setPosition(data);
        recoverCamera = data;
        handleBlurPosition();
    };
    
    if (hasPermission === null) {
      return <Text>Solicitando permissão para usar a câmera</Text>;
    }
    if (hasPermission === false) {
      return <Text>Permissão para acessar a câmera negada</Text>;
    }

    const cancel = () => {
        setPN("")
        setPosition("")
        setDescription("")
        setQty("")
    }
    return (

        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.text}>Inventário - Contagem</Text>
                </View>

                <Text style={styles.label}>Posição/Locação </Text>
                <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TextInput placeholder="Posição/Locação"
                        style={{width:'80%',        
                            margin: 0,
                            backgroundColor: 'white',
                            boderColor: "black",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5
                        }} 
                        value={position}
                        onChangeText={setPosition}
                        onBlur={handleBlurPosition}
                    />
                    <Pressable onPress={()=>setScannedShowPosition(!scannedShowPosition)} >
                        <Ionicons name='barcode-outline' size={50} color='green'/>
                    </Pressable>
                </View>
                {!scannedShowPosition 
                    ? null
                    :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScannedPosition}
                                style={{ height: 300, width: 300 }}
                            />
                        </View>
                }

                <Text style={styles.label}>PN: </Text>
                <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TextInput placeholder="PN"
                        style={{width:'80%',        
                            margin: 0,
                            backgroundColor: 'white',
                            boderColor: "black",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5
                        }}
                        value={pn}
                        onChangeText={setPN}
                        onBlur={handleBlurPN}
                    />
                    <Pressable onPress={()=>setScannedShow(!scannedShow)} >
                        <Ionicons name='barcode-outline' size={50} color='green'/>
                    </Pressable>
                </View>

                {!scannedShow 
                    ? null
                    :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={{ height: 400, width: 400 }}
                            />
                        </View>
                }
                <Text style={styles.label}>Descrição: {description}</Text>


                <Text style={styles.label}>Quantidade:</Text>
                <TextInput placeholder="Quantidade"
                    style={styles.input}
                    value={qty}
                    keyboardType="numeric"
                    onChangeText={setQty} />
            </View>

            <View>
                <Pressable onPress={register} style={styles.button}>
                    <Text style={styles.text}>Registrar</Text>
                </Pressable>
                <Pressable onPress={cancel} style={styles.button}>
                    <Text style={styles.text}>Cancelar</Text>
                </Pressable>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hideMessage}
                style={{justifyContent: 'center', // Centraliza verticalmente
                        alignItems: 'center',  }}>
                <BlurView intensity={150} style={StyleSheet.absoluteFill}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.message}>{modalTitle}</Text>
                            <Text style={styles.message}>{modalMsg}</Text>
                            <Button title="Fechar" onPress={hideMessage} />
                        </View>
                    </View>
                </BlurView>
            </Modal>
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
        backgroundColor: 'white',
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
        margin: 15,
    },

    modalContent: {
        justifyContent: 'center',
        alignItems:'center',
        alignContent:'center',
        width:'80%',
        backgroundColor:'white',
        padding:20,
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 10,
    }, 
    modalContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:"center",
    },
    message:{
        margin:5,
        fontSize:18,

    }
});