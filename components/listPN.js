import { React, useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView, Pressable, Button, Modal } from "react-native";
import { BlurView } from 'expo-blur';
import { AppContext } from "./src/context/AppContext";
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import MyModal from "./myModal";

export default function ListPn({navigation}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('')
    
    const { URL, 
            gPosition, 
            setGPosition, 
            setGPN, 
            setGDescription,
            setGScore,
            userProfile} = useContext(AppContext)

    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            
            if (!gPosition) return;

            try {                
                const res = await fetch(`${URL}/api/invproducts?position=${gPosition}`)
                const data = await res.json()
                // console.log(data)
                setData(data)
            } catch (error) {                
                console.error("listPN-Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            };
        }
        fetchData();
    }, [gPosition]);

    if (loading) {
        return <Text>Carregando dados...</Text>
    }

    const filteredData = searchId
        ? data.filter(item => item.PN.includes(searchId))
        : data;

    const handlerSelectItem = (item) => {        
        
        if (!item.Qty || userProfile==='ADMINISTRATOR') {  
            setGPN(item.PN);
            setGPosition(item.Position);
            setGDescription(item.Description);
            setGScore(item.Score);
            navigation.navigate("Digitação");
        } else {
            setModalVisible(true)
            setModalTitle("Bloqueio")
            setModalMsg("PN já foi digitado, você não tem permissão para alterar!")
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
  
    return (
        <View style={{height:'100%'}}>
            <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <TextInput
                    style={styles.input}
                    placeholder="🔍 Digite o código do produto"
                    value={searchId}
                    onChangeText={(text) => setSearchId(text.toUpperCase())} 
                    autoCapitalize="characters"/>
                <Pressable onPress={()=>setScannedShow(!scannedShow)} >
                    <Ionicons name='barcode-outline' size={50} color='green'/>
                </Pressable>
            </View>
            <View style={{alignItems:'flex-start', justifyContent:'flex-end', paddingRight:20, display:'flex', flexDirection:'row'}}>
                <TouchableOpacity style={styles.checkbox} onPress={()=>setIsChecked(!isChecked)}>
                    {isChecked && <View style={styles.checkmark} />}
                </TouchableOpacity>
                <Text>{isChecked ? 'Listando todos PN' : 'Listando apenas Pendente'}</Text>
            </View>
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
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlerSelectItem(item)}>
                        {isChecked || (!isChecked && !item.Qty)
                            ? 
                                <View  key={item.PN} 
                                    style={{backgroundColor: item.Qty ? '#ccffcc' : '#f9f9f9',
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
                                        marginLeft: 10}} >
                                    <View style={{display:'flex', flexDirection:'row'}}>
                                        <View  style={{width:'80%'}} >
                                            <Text style={styles.title}>PN: {item.PN}</Text>
                                            <Text>Descrição: {item.Description}</Text>
                                            <Text>Posição: {item.Position}</Text>
                                            <Text>Contagem: {item.Score}</Text>
                                        </View>
                                        {item.Qty
                                            ?
                                                <View  
                                                        style={{alignItems:'center', 
                                                                justifyContent:'center', 
                                                                backgroundColor:'#cceeff', 
                                                                padding:3,
                                                                width: '20%'}} >
                                                    <Text>Contado</Text>
                                                    <Text style={{fontSize:15}} >{parseFloat(item.Qty)}</Text>
                                                    <Text style={{fontSize:8}} >{item.name}</Text>
                                                </View>

                                            : null
                                        }

                                    </View>
                                </View>
                            : null
                        }
                    </TouchableOpacity>
                )}
            />
            <MyModal
                modalVisible = {modalVisible}
                modalTitle = {modalTitle}
                modalMsg = {modalMsg}
                setModalVisible = {setModalVisible}
                >
            </MyModal>
            <View style={{justifyContent:'center', 
                            paddingRight:20,
                            alignItems:"center"
                            }}>
                <View style={styles.box}>
                    <Text style={{fontSize:20,
                        fontWeight:"bold",
                    }}>Resumo: </Text>
                </View>
                <View style={styles.boxItems}>
                    <Text style={styles.text}>Total: </Text>
                    <Text style={styles.text}>Pendente: </Text>
                    <Text style={styles.text}>Zerado: </Text>
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

    },
    box:{
        justifyContent:"center",
        marginBottom:10,
        fontSize:35,
    },
    boxItems:{
        flexDirection:"row",
        marginBottom:10,
        justifyContent: "space-between",
    },
    text:{
        fontSize:17,
    }

});
