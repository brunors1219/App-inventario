import { React, useState, useContext, useEffect, useRef, useCallback } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, Button, Modal } from "react-native";
import { AppContext } from "./src/context/AppContext";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';

export default function InventarioS({ navigation }) {

    const [position, setPosition] = useState("")
    const [description, setDescription] = useState("")
    const [pn, setPN] = useState("")
    const [qty, setQty] = useState("")
    const [positions, setPositions] = useState("")
    const [pns, setPNs] = useState("")
    const [score, setScore] = useState("")

    const { URL, user, setGPosition, gPosition, setGPN, gPN, gDescription } = useContext(AppContext)

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");
    const [qtyKey, setQtyKey] = useState(0)
    const [PNKey, setPNKey] = useState("")
    const [visibleBarCodePN, setVisibleBarCodePN] = useState(true)

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

    useFocusEffect(
        useCallback(() => {
            console.log("carregando...." + gPN +" - " + gPosition)
            loadData()

            return () => {
                // Código a ser executado quando a tela perder foco, se necessário
                setGPN("");
                setGPosition("");        
            };
        }, [])
    );    


    const loadData = () => {
        if (gPosition) {
            setPosition(gPosition);
            // setTimeout(handleBlurPosition, 1000);
        }
        if (gPN) {
            setPN(gPN);
            setDescription(gDescription);
            // setTimeout(handleBlurPN, 1000);
            focusTextInputQty()
        } 
        setGPN("");
        setGPosition("");        
    }

    useEffect(()=>{
        if (pn=="") setScore(0)
    },[pn])

    const register = async () => {

        if (!qty) {
            setModalVisible(true)
            setModalMsg("Informe uma Quantidade!")
            focusTextInputQty();
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
        setModalVisible(true);
        
        setModalMsg(data.message);
        setQty('');
        setPN('');
        setDescription('');
        focusTextInputPN();
    }

    const handleBlurPosition = () => {
        // Verifica se a posição existe no vetor
        if (position === "" && recoverCamera == "") return;

        if (positions.includes(position.toUpperCase()) || positions.includes(recoverCamera.toUpperCase())) {
            focusTextInputPN();
        }else {
            setModalTitle('Posição inválida');
            setModalMsg('A posição não existe no armazém.');
            setModalVisible(true);
            setPosition("");
        }

        recoverCamera = ""
    };

    const handleBlurPN = () => {

        if (position === "") {
            setModalTitle('Ação');
            setModalMsg('Digite primeiro a POSIÇÃO');
            setModalVisible(true);            
            cancel();
            return;
        }

        if (pn === "" && recoverCamera == "") return;

        // Verifica se a PN existe no cadastro
        _pn = pns.filter(f => f.PN          == pn.toUpperCase() 
                            || f.PN         == recoverCamera.toUpperCase()
                            || f.PNSimple   == pn.toUpperCase()
                            || f.PNSimple   == recoverCamera.toUpperCase())
        console.log(_pn)
        _pnExist = _pn.length > 0
        if (!_pnExist) {
            setModalTitle('PN inválido');
            setModalMsg('A PN não existe no cadastro. Acione o time de suporte!');
            setModalVisible(true);
            setPN("");
            focusTextInputPN();
            return;
        }

        setPN(_pn[0].PN)

        if (recoverCamera!="") {
            _pnExistPosition = pns.filter(f => f.PN == recoverCamera.toUpperCase() && f.Position == position.toUpperCase()).length > 0
        } else {
            _pnExistPosition = pns.filter(f => f.PN == pn.toUpperCase() && f.Position == position.toUpperCase()).length > 0
        }
        
        recoverCamera = ""
        
        if (!_pnExistPosition) {
            if (qtyKey==0 || PNKey != _pn[0].PN){
                setModalTitle('PN fora locação');
                setModalMsg('A PN existe, mas não é dessa posição. Para ter certeza do PN é necessário digitar ele mais uma vez!');
                setModalVisible(true);
                setQtyKey(1);
                setPNKey(_pn[0].PN)
                setPN("");
                setDescription("");
                focusTextInputPN();
            }
        }

        console.log(_pn);
        setDescription(_pn[0].Description)
        setScore(_pn[0].Score)
        focusTextInputQty();

    };

    const textInputRefPN = useRef(null);
    const textInputRefPosition = useRef(null);
    const textInputRefQty = useRef(null);

    const focusTextInputPN = () => {
      if (textInputRefPN.current) {
        textInputRefPN.current.focus();
      }
    };    
    const focusTextInputPosition = () => {
        if (textInputRefPosition.current) {
            textInputRefPosition.current.focus();
        }
      };    
    const focusTextInputQty = () => {
        if (textInputRefQty.current) {
            textInputRefQty.current.focus();
        }
    };    

    const onFocusPN = () => {
        setPN("")
        setDescription("")
    }
  
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
        setPN("");
        setPosition("");
        setDescription("");
        setQty("");
        setQtyKey(0);
        setPNKey("");
        setScore(0);
        setGPN("");
        setGPosition("");
        focusTextInputPosition();
    }
    return (

        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={{justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                shadowColor: 'black',
                                borderRadius: 5
                            }}>
                    <Text style={{ fontSize: 25,
                                    color: 'blue',
                                    fontWeight: 900,
                                    marginTop: -40,
                                    padding: 15}}>
                        Contagem/Digitação
                    </Text>
                </View>

                <Text style={{fontSize: 16,
                                marginBottom: 5,
                                color: '#333',
                                fontWeight: 600}}>Posição/Locação </Text>
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
                        ref={textInputRefPosition}
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

                <Text style={{fontSize: 16,
                                marginBottom: 5,
                                color: '#333',
                                fontWeight: 600}}>PN </Text>
                <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TextInput placeholder="PN"
                        style={{width:qtyKey===0 ? '80%' : '100%',        
                            margin: 0,
                            backgroundColor: 'white',
                            boderColor: "black",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5
                        }}
                        ref={textInputRefPN}
                        value={pn}
                        onChangeText={setPN}
                        onFocus={onFocusPN}
                        onBlur={handleBlurPN}
                    />
                    {qtyKey===0 
                        ?
                            <Pressable onPress={()=>setScannedShow(!scannedShow)} >
                                <Ionicons name='barcode-outline' size={50} color='green'/>
                            </Pressable>
                        :
                            null
                    }
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

                <View style={{fontSize: 16,
                                marginBottom: 5,
                                color: '#333',
                                display: 'flex',
                                flexDirection:'row'}}>

                    <View style={{fontSize: 16,
                                    marginBottom: 5,
                                    color: '#333',
                                    display: 'flex',
                                    flexDirection:'column',
                                    width: '85%'}}>
                        <Text style={{fontSize: 12,
                                    marginBottom: 5,
                                    marginTop: 15,
                                    color: '#333'}}>
                            Descrição 
                        </Text>
                        <Text style={{fontSize: 20,
                                    marginBottom: 5,
                                    color: '#333',
                                    fontWeight: 900}}>
                            {description}
                        </Text>
                    </View>
                    {score>0 && pn
                        ?
                        <View style={{backgroundColor: score==1 ? 'blue' : score==2 ? '#FFD700' : 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            borderRadius: 10,
                            marginLeft: 5,
                            marginTop: 10,
                            paddingLeft: 5,
                            paddingRight: 5}}>
                            <Text style={{fontSize: 10,
                                        marginBottom: 5,
                                        marginTop: 15,
                                        color: score==1 ? 'white' : score==2 ? 'white' : 'yellow'}}>
                                Contagem
                            </Text>
                            <Text style={{fontSize: 30,
                                        marginBottom: 5,
                                        color: score==1 ? 'white' : score==2 ? 'white' : 'yellow',
                                        fontWeight: 900}}>
                                {score}º
                            </Text>
                        </View>

                        : null
                    }

                </View>


                <Text style={{fontSize: 16,
                                marginBottom: 5,
                                color: '#333',
                                fontWeight: 600}}>Quantidade:</Text>
                <TextInput placeholder="Quantidade"
                    style={styles.input}
                    ref={textInputRefQty}
                    value={qty}
                    keyboardType="numeric"
                    onChangeText={setQty} />
            </View>

            <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Pressable onPress={register} 
                    style={{backgroundColor: '#006400',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            borderRadius: 10,
                            margin: 15}}>
                    <Text style={{fontSize: 15,
                                    color: 'white',
                                    fontWeight: 900,
                                    padding: 15}}>Registrar</Text>
                </Pressable>
                <Pressable onPress={cancel} style={styles.button}>
                    <Text style={{fontSize: 15,
                                    color: 'white',
                                    fontWeight: 900,
                                    padding: 15}}>Cancelar</Text>
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

    label: {
        fontSize: 16,
        marginBottom: 5,
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