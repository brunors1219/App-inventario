import { StyleSheet } from "react-native";
import parameters from "../../services/parameters";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderRadius: 30,
    // backgroundColor: 'tomato'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    width: "80%",
    // height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 150,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#263236",
  },
  buttonClose: {
    backgroundColor: "#263236",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: "center",
    fontSize: 20,
  },
  btn: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "8%",
    backgroundColor: parameters.colorApp,
    paddingTop: 14,
    paddingBottom: 14,
    // marginTop: 10,
    marginBottom: 10,
  },
  txtBtn: {
    color: "#fff",
    fontSize: 22,
  },
});

export default styles;
