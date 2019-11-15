// SearchTab.js
// 앱 메인 화면에서의 '검색' 탭

import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { List, Searchbar } from "react-native-paper";
import _ from "lodash";
import axios from "axios";

const colors = ["#EF7777", "#dee823", "#33de49"];
export default class SearchTab extends Component {
  // 네비게이터 옵션
  static navigationOptions = {
    header: null,
  };

  search = async () => {
    axios
      .get("http://192.168.0.10:3000/api/search")
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(err => {
        console.log(err);
      });
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

  constructor(props) {
    super(props);
    //setting default state
    this.state = { text: "", refreshing: false };
    this.search();
    console.log(this.state.data);
    this.arrayholder = this.state.data;
  }

  // 리스트에 끝에 도달하면 호출되는 Method
  // 10개의 데이터를 state.data에 추가한다.
  // TODO : 오랫동안 리스트를 밀었을 때 최적화

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.phonenumber ? item.phonenumber.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      data: newData,
      text: text,
    });
  }

  // 리스트 항목을 누르면 호출되는 Method
  // Detail 창으로 이동, item 정보 전달

  // Pull to Refresh를 시도할 때 호출되는 Method
  // 데이터 20개를 다시 받는다.
  onRefresh_list = () => {
    this.search();
  };

  // 리스트의 내용을 출력할 때 호출되는 Method
  onRenderItem = ({ item }) => {
    return (
      <List.Item
        title={
          item.phonenumber.slice(0, 3) +
          "-" +
          item.phonenumber.slice(3, 7) +
          "-" +
          item.phonenumber.slice(7, 11)
        }
        description={item.company}
        onPress={() => {
          this.props.navigation.navigate("Detail", { item });
        }}
        // TODO : 신용에 따라 맞춤 아이콘으로 적용하기
        left={props => (
          <List.Icon color={colors[this.setCredit(item.FoodHistory.length)]} icon="account" />
        )}
      />
    );
  };

  // '검색' 탭에 표시되는 내용
  render() {
    return (
      <View>
        <Searchbar
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          placeholder="010########"
        />
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={this.onRenderItem}
            keyExtractor={(item, key) => item.key}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh_list}
          ></FlatList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topIcon: {
    paddingLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120,
  },
  viewStyle: {
    justifyContent: "center",
    flex: 1,
    marginTop: 40,
    padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    padding: 10,
  },
});
