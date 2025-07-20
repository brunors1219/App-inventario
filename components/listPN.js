import { React, useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable, } from "react-native";
import { AppContext } from "./src/context/AppContext";
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import MyModal from "./myModal";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function ListPn({ navigation }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('')

    const { URL,
        gPosition,
        setGPosition,
        setGPN,
        setGDescription,
        setGScore,
        gENVIRONMENT,
        token } = useContext(AppContext)

    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");

    const [chkAllPN, setChkAllPN] = useState(false);
    const [chkPendingPN, setChkPendingPN] = useState(true);

    const { t } = useTranslation();
    
    // useEffect(() => {
    //     setData([])
    //     loadData();
    // }, [gPosition]);

    useFocusEffect(
        useCallback(() => {
            if (gPosition) {
                loadData();
            } else {
                console.warn("gPosition está indefinido.");
            }
        }, [gPosition])
    );

    const loadData = async () => {
        if (!gPosition) return; // Condição extra de segurança

        try {
            const res = await fetch(`${URL}/api/invproducts?${token}&position=${gPosition}`);
            const data = await res.json();
            setData(data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <Text>Carregando dados...</Text>
    }

    const handlerSelectItem = (item) => {

        if (item.status === "Encerrado") {
            setModalVisible(true)
            setModalTitle("Bloqueio")
            setModalMsg("Posição já foi encerrada não pode mais ser alterada!")
        } else {
            setGPN(item.PN);
            setGPosition(item.Position);
            setGDescription(item.Description);
            setGScore(item.Score);
            navigation.navigate("Digitação");
        }

    }

    const hideMessage = () => {
        setModalVisible(false);
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScannedData(data);
        setScannedShow(false);
        setSearchId(data);
    };

    // const [refreshing, setRefreshing] = useState(false);

    // Função de atualização ao puxar a lista para baixo
    // const onRefresh = useCallback(() => {
    //     setRefreshing(true);
    //     // Simule uma atualização com um timeout (ou substitua com uma função async para buscar novos dados)
    //     setTimeout(() => {
    //         // Atualize os dados aqui (substitua por sua lógica de atualização)
    //         loadData();
    //         setRefreshing(false); // Pare o indicador de atualização
    //     }, 2000);
    // }, [data]);

    //const totalItems = data.filter(item => item.Qty).length > data.filter(item => item.QtyOrigin > 0).length ? data.filter(item => item.Qty).length : data.filter(item => item.QtyOrigin > 0).length;
    
    const filteredData = searchId
        ? data.filter(item => item.PN.includes(searchId) && ((!isChecked && (item.QtyOrigin > 0 || item.Score > 1) && !item.Qty) || (isChecked && (item.Qty || item.QtyOrigin > 0 || item.Score > 1))))
        : data.filter(item => (!isChecked && (item.QtyOrigin > 0 || item.Score > 1) && !item.Qty) || (isChecked && (item.Qty || item.QtyOrigin > 0 || item.Score > 1)));
    
    const totalItems = data.filter(item => item.QtyOrigin >0 || item.Qty || item.Score > 1).length;
    const pendingItems = data.filter(item => !item.Qty && (item.QtyOrigin > 0 || item.Score > 1)).length;
    const countedItems = data.filter(item => item.Qty).length;

    const chkPendingPNSet = () => {
        setChkAllPN(false);
        setChkPendingPN(true);
        setIsChecked(false)
    }
    const chkAllPNSet = () => {
        setChkPendingPN(false)
        setChkAllPN(true)
        setIsChecked(true)
    }

    return (
        <View style={{ height: '100%' }}>
            <View style={{ padding: 0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <TextInput
                    style={styles.input}
                    placeholder="🔍 Digite o código do produto"
                    value={searchId}
                    onChangeText={(text) => setSearchId(text.toUpperCase())}
                    autoCapitalize="characters" />
                <Pressable onPress={() => setScannedShow(!scannedShow)} >
                    <Ionicons name='barcode-outline' size={50} color='green' />
                </Pressable>
            </View>
            <View style={{ alignItems: 'stretch', justifyContent: 'space-between',  marginLeft: 30, marginRight: 30, padding: 5, display: 'flex', flexDirection: 'row' }}>
                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.checkbox} onPress={chkAllPNSet}>
                        {chkAllPN && <View style={styles.checkmark} />}
                    </TouchableOpacity>
                    <Text>Todos PNs</Text>
                </View>
                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.checkbox} onPress={chkPendingPNSet}>
                        {chkPendingPN && <View style={styles.checkmark} />}
                    </TouchableOpacity>
                    <Text>PNs Pendentes</Text>
                </View>
            </View>

            {/* <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 20, display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity style={styles.checkbox} onPress={() => setIsChecked(!isChecked)}>
                    {isChecked && <View style={styles.checkmark} />}
                </TouchableOpacity>
                <Text>{isChecked ? 'Listando todos PN' : 'Listando apenas Pendente'}-{gPosition}</Text>
            </View> */}
            {!scannedShow
                ? null
                :
                <View style={{ flex: 1, alignItems: 'center', zIndex: 100 }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: 400, width: 400 }}
                    />
                </View>
            }

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handlerSelectItem(item)}>
                        {/* {isChecked || (!isChecked && !item.Qty && item.QtyOrigin > 0)
                            ? */}
                        <View key={item.PN}
                            style={{
                                backgroundColor: item.Qty ? '#ccffcc' : '#f9f9f9',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                padding: 15,
                                marginVertical: 8,
                                borderRadius: 8,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                                width: '95%',
                                marginLeft: 10
                            }} >
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '80%' }} >
                                    <Text style={styles.title}>{index + 1}-PN: {item.PN}</Text>
                                    <Text>Descrição: {item.Description}</Text>
                                    <Text>Posição: {item.Position}{item.PositionAux ? "," + item.PositionAux : null }</Text>
                                    <Text>Contagem: {item.Score} {gENVIRONMENT === 'DEV' ? 'Qtd.Original: ' + item.QtyOrigin : null} </Text>
                                </View>
                                {item.Qty
                                    ?
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: item.Score == 1 ? 'green' : item.Score == 2 ? 'blue' : item.Score == 3 ?'yellow': 'red',
                                            padding: 3,
                                            width: '20%'
                                        }} >
                                        <Text style={{ color: item.Score == 1 ? 'black' : item.Score == 2 ? 'white' : 'black' }}>
                                            Qtd.
                                        </Text>
                                        <Text style={{ fontSize: 15, 
                                                        color: item.Score == 1 ? 'black' : item.Score == 2 ? 'white' : 'black' }} >
                                            {parseFloat(item.Qty)}
                                        </Text>
                                        <Text style={{ fontSize: 10, 
                                                        fontWeight: 900, 
                                                        color: 'white'}} >
                                            {item.PositionCounter}
                                        </Text>
                                        <Text style={{ fontSize: 8, 
                                                        color: item.Score == 1 ? 'black' : item.Score == 2 ? 'white' : 'black'}} >
                                            {item.name}
                                        </Text>
                                    </View>

                                    : null
                                }

                            </View>
                        </View>
                        {/* : null
                        } */}
                    </TouchableOpacity>
                )}
            // refreshControl={
            //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
            />
            <MyModal
                modalVisible={modalVisible}
                modalTitle={modalTitle}
                modalMsg={modalMsg}
                setModalVisible={setModalVisible}
            >
            </MyModal>
            <View style={{
                justifyContent: 'center',
                alignItems: "center",
                backgroundColor: 'white',
                padding: 10,
                borderRadius:25,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },  
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
                marginBottom: 3,
                marginLeft: 10,
                marginRight: 10

            }}>
                {/* <View style={styles.box}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom:7,
                        color:'green'
                    }}>Resumo</Text>
                </View> */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.text, { flex: 1, textAlign: 'left', marginLeft: 10 }]}>
                        Total: <Text style={{ fontWeight: 'bold' }}>{totalItems}</Text>
                    </Text>
                    <Text style={[styles.text, { flex: 1, textAlign: 'center' }]}>
                        Pendente: <Text style={{ fontWeight: 'bold' }}>{pendingItems}</Text>
                    </Text>
                    <Text style={[styles.text, { flex: 1, textAlign: 'right', marginRight: 10 }]}>
                        Contado: <Text style={{ fontWeight: 'bold' }}>{countedItems}</Text>
                    </Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9f9f9',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '95%',
        marginLeft: 10
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    input: {
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        fontSize: 15,
        margin: 10,
        width: '75%'
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 8,
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

    },
    box: {
        justifyContent: "center",
        fontSize: 35,
    },
    boxItems: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    boxResume:{

    },
    
    text: {
        fontSize: 15,
        marginRight: 2,
        color:'green'
    },

});
