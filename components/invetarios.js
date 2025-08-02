import { React, useState, useContext, useRef, useEffect, useCallback } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { AppContext } from "./src/context/AppContext";
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';
import MyModal from "../components/myModal";
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { exists } from "i18next";

export default function InventarioS({ navigation }) {

    const { URL,
        idCompany,
        idInventory,
        userId,
        clearContextItem,
        setForceUpdate ,
        token } = useContext(AppContext)

    const route = useRoute();
    
    console.log(route)

    const [position, setPosition] = useState(route.params?.position)
    const [description, setDescription] = useState(route.params?.description)
    const [pn, setPN] = useState(route.params?.pn)
    const [qty, setQty] = useState(route.params?.qty)
    const [positions, setPositions] = useState("")
    const [pns, setPNs] = useState("")
    const [score, setScore] = useState(route.params?.score)
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);
    const [isLoadingEnd, setIsLoadingEnd] = useState(false);
    const [navigationPage, setNavigationPage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");
    const [qtyKey, setQtyKey] = useState(0)
    const [PNKey, setPNKey] = useState("")
    const [visibleBarCodePN, setVisibleBarCodePN] = useState(true)

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);
    const [scannedShowPosition, setScannedShowPosition] = useState(false);

    const [chkIncrease, setChkIncrease] = useState(false);
    const [chkUpdate, setChkUpdate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const { t } = useTranslation();
    
    useEffect(() => {

        // console.log(userId);

        loadDataDB();

    }, [])


    const loadDataDB = () => {

        const fetchData = async () => {

            try {
                const res = await fetch(`${URL}/api/invproducts?${token}&selection=products`)
                const data = await res.json()
                console.log(data)
                setPNs(data)
                setChkIncrease(false)
                setChkUpdate(false)
                
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
      
    }

    // useEffect(() => {
    //     if (myRoutes.position) {
    //         setPosition(myRoutes.position);
    //     }
    //     if (gPN) {
    //         setPN(gPN);
    //         setDescription(gDescription);
    //         setScore(gScore)
    //         // setTimeout(handleBlurPN, 1000);
    //         focusTextInputQty();
    //         clearContextItem();
    //     }

    // }, [gPosition, gPN]);

    useEffect(() => {
       setPosition(route.params?.position);
    }, [route.params?.position]);


    useFocusEffect(
        useCallback(() => {
            setPosition(route.params?.position);
            setPN(route.params?.pn);
            setDescription(route.params?.description);
            setScore(route.params?.score)
            setQty(route.params && route.params.qty !== undefined ? route.params.qty : ""); // Corrigido para evitar undefined
            setIsUpdate(route.params && route.params.qty !== undefined && route.params.qty !== "" && route.params.qty !== null);
            // setTimeout(handleBlurPN, 1000);
            focusTextInputQty();
            clearContextItem();

            // Código a ser executado quando a tela ganha o foco
            loadDataDB();

            //loadData();           

            return () => {
                // Código a ser executado quando a tela perder foco, se necessário
                clearContextItem();
            };
        }, [route.params?.pn, route.params?.position, route.params?.qty])
    );

    useEffect(() => {
        if (pn == "") setScore(0)
    }, [pn])
   

    const ZerarContagem = async () => {

        setIsLoadingEnd(true);

        if (!position) {
            setNavigationPage('');
            setModalVisible(true)
            setModalMsg("Informe a Posição!")
            focusTextInputPosition();
            return
        }

        const body = {}

        body.Position = position
        body.User_Id = userId
        body.idCompany = idCompany
        body.idInventory = idInventory
        body.zerocounter = true

        const res = await fetch(`${URL}/api/invproducts`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                //make sure to serialize your JSON body
                body: JSON.stringify(body)
            });
        const data = await res.json();
        
        console.log(data);

        setModalMsg(data.message);

        if (!res.ok) {
            setNavigationPage('');
            setModalTitle('Alerta')
            setModalType('error')
            setIsUpdate(false)
            setModalVisible(true);
            return
        } else {
            setNavigationPage('listPn');
            setModalTitle('Informação')
            setModalType('success')
            setIsUpdate(false)
            setModalVisible(true);
        }

    }

    const register = async () => {
    
        setIsLoadingRegister(true);

        // Verifica se qty é um número válido e positivo
        if (!qty || isNaN(qty) || Number(qty) <= 0) {
            setNavigationPage('')
            setModalVisible(true)
            setModalMsg("Informe uma Quantidade válida!")
            focusTextInputQty();
            setIsLoadingRegister(false);
            return
        }

        if (!position) {
            setNavigationPage("")
            setModalVisible(true)
            setModalMsg("Informe a Posição!")
            focusTextInputPosition();
            return
        }
        if (!pn) {
            setNavigationPage("")
            setModalVisible(true)
            setModalMsg("Informe o PN!")
            focusTextInputPN();
            return
        } 

        if (isUpdate) {
           
            if (!chkIncrease && !chkUpdate) {

                setNavigationPage("")
                setModalVisible(true)
                setModalMsg("É necessário selecionar a Ação ADICIONAR ou ALTERAR")
                
                return
            }
        }

        const body = {}

        body.idCompany = idCompany
        body.idInventory = idInventory
        body.counter = true
        body.PN = pn
        body.Position = position
        body.Qty = Number(qty) // Garante que seja número
        body.User_Id = userId
        body.kindUpdate = chkIncrease ? "increase" : "update"

        console.log(body);

        const res = await fetch(`${URL}/api/invproducts`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                //make sure to serialize your JSON body
                body: JSON.stringify(body)
            });
        const data = await res.json();
        
        setModalMsg(data.message);

        if (!res.ok) {
            setModalTitle('Alerta')
            setModalType('error')
            if (res.status===500) setIsUpdate(true)
            setNavigationPage('')
            setModalVisible(true);
            return
        } else {
            setModalTitle('Informação')
            setModalType('success')
            setIsUpdate(false)
            setNavigationPage('')
            setModalVisible(true);
        }

        setQty('');
        setQtyKey(0);
        setPN('');
        setDescription('');
        focusTextInputPN();
        setIsUpdate(false);
        setForceUpdate(true);
    }

    const handleBlurPosition = () => {

        if (!recoverCamera) recoverCamera = ""

        // Verifica se a posição existe no vetor
        if (position === "" && recoverCamera == "") return;

        if (positions.includes(position.toUpperCase()) || positions.includes(recoverCamera.toUpperCase())) {
            focusTextInputPN();
        } else {
            setNavigationPage('');
            setModalTitle('Posição inválida');
            setModalMsg('A posição não existe no armazém.');
            setModalVisible(true);
            setPosition("");
            focusTextInputPosition();
        }

        recoverCamera = ""
    };

    const handleBlurPN = () => {
        
        if (modalVisible) return;

        if (position === "") {
            setNavigationPage('');
            setModalTitle('Ação');
            setModalMsg('Digite primeiro a POSIÇÃO');
            setModalVisible(true);
            setIsLoadingEnd(false);
            setIsLoadingRegister(false);
            cancel();
            return;
        }
        
        if (pn === "" && recoverCamera == "") return;

        // Verifica se a PN existe no cadastro
        _pn = ! pns ? null : pns.filter(f => f.PN.toUpperCase() == pn.toUpperCase()
            || f.PN.toUpperCase() == recoverCamera.toUpperCase()
            || f.PNSimple.toUpperCase() == pn.toUpperCase()
            || f.PNSimple.toUpperCase() == recoverCamera.toUpperCase()
            || f.PN.toUpperCase() == recoverCamera.match(/\d{3}\.\d{4}-\d{2}/)
        )

        _pnExist = _pn.length > 0
        if (!_pnExist) {
            setNavigationPage('');
            setModalTitle('PN inválido');
            setModalMsg('A PN não existe no cadastro. Acione o time de suporte!' + 'Rec:' + recoverCamera + " pn :" + pn);
            setModalVisible(true);
            setPN("");
            focusTextInputPN();
            return;
        }

        if (recoverCamera!="") {
            console.log("a", recoverCamera!="")
            _pnExistPosition = pns.filter(f => (f.PN == recoverCamera.toUpperCase() 
                                                || f.PNSimple == recoverCamera.toUpperCase()
                                                || f.PN == recoverCamera.match(/\d{3}\.\d{4}-\d{2}/) )
                                                && (f.Position == position.toUpperCase()
                                                || (f.PositionAux ? f.PositionAux.includes(position.toUpperCase()) : true)
                                                )).length > 0
        } else {
            console.log("b", pn, position)
            _pnExistPosition = pns.filter(f => (f.PN == pn.toUpperCase() 
                                                || f.PNSimple == pn.toUpperCase() 
                                                || f.PN == pn.match(/\d{3}\.\d{4}-\d{2}/))
                                                && (f.Position == position.toUpperCase()
                                                || (f.PositionAux ? f.PositionAux.includes(position.toUpperCase()) : true)
                                                )).length > 0
        }

        setPN(_pn[0].PN)

        recoverCamera = ""

        if (!_pnExistPosition) {
            if (qtyKey == 0 || PNKey != _pn[0].PN) {
                setNavigationPage('');
                setModalTitle('PN fora locação');
                setModalMsg('A PN existe, mas não é dessa posição. Para ter certeza do PN é necessário digitar ele mais uma vez!');
                setModalVisible(true);
                setQtyKey(1);
                setPNKey(_pn[0].PN)
                setPN("");
                setDescription("");
                focusTextInputPN();
                return;
            }
        }

        // console.log(_pn);
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
        setNavigationPage('');
        setModalVisible(false);
    };

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
        setIsUpdate(false);
        setIsLoadingEnd(false);
        setIsLoadingRegister(false);
        focusTextInputPosition();
    }

    const chkUpdateSet = () => {
        if (!chkUpdate) setChkIncrease(false);
        setChkUpdate(!chkUpdate);

    }
    const chkIncreaseSet = () => {
        if (!chkIncrease) setChkUpdate(false)
        setChkIncrease(!chkIncrease)
    }

    return (

        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    shadowColor: 'black',
                    borderRadius: 5
                }}>
                    <Text style={{
                        fontSize: 25,
                        color: 'blue',
                        fontWeight: "900",
                        marginTop: -20,
                        padding: 15
                    }}>
                        {t("Contagem/Digitação")}
                    </Text>
                </View>

                <Text style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: '#333',
                    fontWeight: "600"
                }}>{t("Posição/Locação")}</Text>
                <View style={{ padding: 0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TextInput placeholder={t("Posição/Locação")} 
                        style={{
                            width: '80%',
                            margin: 0,
                            backgroundColor: 'white',
                            boderColor: "black",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5
                        }}
                        ref={textInputRefPosition}
                        value={position}
                        onChangeText={(text) => setPosition(text.toUpperCase())}
                        onBlur={handleBlurPosition}
                        autoCapitalize="characters"
                    />
                    <Pressable onPress={() => setScannedShowPosition(!scannedShowPosition)} >
                        <Ionicons name='barcode-outline' size={50} color='green' />
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

                <Text style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: '#333',
                    fontWeight: "600"
                }}>PN </Text>
                <View style={{ padding: 0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TextInput placeholder="PN"
                        style={{
                            width: qtyKey === 0 ? '80%' : '100%',
                            margin: 0,
                            backgroundColor: 'white',
                            boderColor: "black",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5
                        }}
                        ref={textInputRefPN}
                        value={pn}
                        onChangeText={(text) => setPN(text.toUpperCase())}
                        onFocus={onFocusPN}
                        onBlur={handleBlurPN}
                        autoCapitalize="characters"
                    />
                    {qtyKey === 0
                        ?
                        <Pressable onPress={() => setScannedShow(!scannedShow)} >
                            <Ionicons name='barcode-outline' size={50} color='green' />
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

                <View style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: '#333',
                    display: 'flex',
                    flexDirection: 'row'
                }}>

                    <View style={{
                        fontSize: 16,
                        marginBottom: 5,
                        color: '#333',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '85%'
                    }}>
                        <Text style={{
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 15,
                            color: '#333'
                        }}>
                            {t("descricao")}
                        </Text>
                        <Text style={{
                            fontSize: 20,
                            marginBottom: 5,
                            color: '#333',
                            fontWeight: "900"
                        }}>
                            {description}
                        </Text>
                    </View>
                    {score > 0 && pn
                        ?
                        <View style={{
                            backgroundColor: score == 1 ? 'green' : score == 2 ? 'blue' : score == 3 ?'yellow': 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            borderRadius: 10,
                            marginLeft: 5,
                            marginTop: 10,
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>
                            <Text style={{
                                fontSize: 10,
                                marginBottom: 5,
                                marginTop: 15,
                                color: score == 1 ? 'black' : score == 2 ? 'white' : 'black'
                            }}>
                                Contagem
                            </Text>
                            <Text style={{
                                fontSize: 30,
                                marginBottom: 5,
                                color: score == 1 ? 'black' : score == 2 ? 'white' : 'black',
                                fontWeight: "900"
                            }}>
                                {score}º
                            </Text>
                        </View>

                        : null
                    }

                </View>


                <Text style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: '#333',
                    fontWeight: "600"
                }}>{t("quantidade")}</Text>
                <TextInput placeholder={t("quantidade")}
                    style={styles.input}
                    ref={textInputRefQty}
                    value={qty}
                    keyboardType="numeric"
                    onChangeText={setQty} />
            </View>

            {isUpdate
                ?
                <View style={{ alignItems: 'stretch', justifyContent: 'space-between', paddingRight: 20, display: 'flex', flexDirection: 'row', padding: 20 }}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.checkbox} onPress={chkIncreaseSet}>
                            {chkIncrease && <View style={styles.checkmark} />}
                        </TouchableOpacity>
                        <Text>{t("ADICIONAR Cont")}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.checkbox} onPress={chkUpdateSet}>
                            {chkUpdate && <View style={styles.checkmark} />}
                        </TouchableOpacity>
                        <Text>{t("ALTERAR Cont")}</Text>
                    </View>
                </View>

                : null
            }

            <View style={{ padding: 0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Pressable onPress={register}
                    style={styles.buttonReg}
                    disabled={isLoadingRegister}
                >
                    {isLoadingRegister ? (
                        <ActivityIndicator size={45} color="#fff" />
                    ) : (
                        <Text style={{
                            fontSize: 20,
                            color: 'white',
                            fontWeight: "900",
                            padding: 15
                        }}>Registrar</Text>
                    )}
                </Pressable>
                <Pressable onPress={cancel} style={styles.button}>
                    <Text style={{
                        fontSize: 15,
                        color: 'white',
                        fontWeight: "900",
                        padding: 15
                    }}>Cancelar</Text>
                </Pressable>
            </View>

            <View style={{ margin: 20, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Pressable onPress={ZerarContagem}
                    style={styles.buttonZerar}
                    disabled={isLoadingEnd}
                >
                    {isLoadingEnd ? (
                        <ActivityIndicator size={45} color="#fff" />
                    ) : (
                        <Text style={{
                            fontSize: 12,
                            color: 'white',
                            fontWeight: "900",
                            padding: 15
                        }}>Encerrar Contagem Posição</Text>
                    )}
                </Pressable>
            </View>


            <MyModal
                modalVisible={modalVisible}
                modalTitle={modalTitle}
                modalMsg={modalMsg}
                setModalVisible={setModalVisible}
                setIsLoading={isLoadingRegister ? setIsLoadingRegister : setIsLoadingEnd}
                navigation={navigation}
                navigationPage={navigationPage}
            >
            </MyModal>

        </ScrollView >
    )
}

const styles = StyleSheet.create({
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
        margin: 15
    },

    modalContent: {

        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
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
        margin: 15
    },
    buttonZerar: {
        backgroundColor: 'blue',        
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10,
        margin: 15
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#4CAF50',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 12,
        height: 12,
        backgroundColor: '#4CAF50',
    },

});