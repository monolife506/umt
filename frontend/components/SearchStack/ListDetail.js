// DelieverInfor.js
// '검색' 탭에서 자세한 정보를 볼 때 나오는 탭

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
} from "react-native";
import { List } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import { createAppContainer, navigation } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { getFood } from "../tmp/fakedata";
//import history from "./overViewAndHistory/history";

export default class Detail extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    data: [],
  };
  // _renderItem = ({ item }) => {
  //   return <Text style={styles.history}>{item.randomStealDate}</Text>;
  // };
  dialCall = number => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };
  FlatListItemSeparator = () => {
    return <View style={{ height: 1, width: "100%", backgroundColor: "#EF7777" }} />;
  };

  onRenderItem = ({ item }) => {
    return <List.Item title={item.StealDate.slice(0, 10)} description={item.StealType} />;
  };

  setCredit = int => {
    if (int >= 5) {
      return 0;
    } else if (int >= 3) {
      return 1;
    } else {
      return 2;
    }
  };

  // 자세한 내용을 보려고 할 때 탭에 표시되는 내용
  render() {
    const { navigation } = this.props;
    const colors = ["#EF7777", "#dee823", "#33de49"];
    const mystuff = navigation.getParam("item", "nothing sent");
    for (let index = 0; index < mystuff.FoodHistory.length; index++) {
      this.state.data.push(mystuff.FoodHistory[index]);
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignContent: "space-around",
      },

      CircleShapeView: {
        width: 125,
        height: 125,
        borderRadius: 125 / 2,
        backgroundColor: mystuff.color,
      },
      overview: {
        flex: 1,
        minHeight: "50%",
        maxHeight: "50%",
        backgroundColor: "powderblue",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-around",
      },
      history: {
        flex: 1,
        minHeight: "50%",
        maxHeight: "50%",
      },
      TextStyle: {
        color: "white",
        fontSize: 30,
        fontWeight: "700",
      },
      ImageBackgroundStyle: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
      },
      IoniconsStyle: {
        alignContent: "center",
        alignItems: "center",
      },
    });

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.ImageBackgroundStyle} source={require("../../image.jpg")}>
          <Ionicons
            style={styles.IoniconsStyle}
            name="ios-happy"
            size={100}
            color={colors[this.setCredit(mystuff.FoodHistory.length)]}
          ></Ionicons>
          <Text style={styles.TextStyle}>{mystuff.company}</Text>
          <TouchableOpacity
            onPress={() => {
              this.dialCall(mystuff.companyPhoneNumber);
            }}
          >
            <Text style={styles.TextStyle}>
              companyNumber:{"\n"}
              {mystuff.companyPhoneNumber.slice(0, 4) +
                "-" +
                mystuff.companyPhoneNumber.slice(4, 8)}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.history}>
          <FlatList
            data={this.state.data}
            keyExtractor={(item, key) => this.state.data.indexOf(item).toString()}
            renderItem={this.onRenderItem}
            ItemSeparatorComponent={this.FlatListItemSeparator}
          ></FlatList>
        </View>
      </SafeAreaView>
    );
  }
}
