// SearchTab.js
// 앱 메인 화면에서의 '검색' 탭

import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { List } from "react-native-paper";
import _ from "lodash";
import { SearchBar } from "react-native-elements";

// Test용 데이터 함수 : 나중에 지울것
import { getData, stealFoodType } from "../tmp/fakedata";

export default class SearchTab extends Component {
  // 네비게이터 옵션
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    //setting default state
    this.state = { data: getData(20), text: "" };
    this.arrayholder = this.state.data;
  }
  // Flatlist 관련 state
  state = {
    refreshing: false

    // TODO: backend 구현 내용에 맞게 받을 데이터 수정
  };

  // 리스트에 끝에 도달하면 호출되는 Method
  // 10개의 데이터를 state.data에 추가한다.
  // TODO : 오랫동안 리스트를 밀었을 때 최적화
  onEndReached = () => {
    this.setState(state => ({
      data: [...state.data, ...getData()]
    }));
  };

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.phonenumber
        ? item.phonenumber.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      data: newData,
      text: text
    });
  }

  // renderHeader() {
  //   return (
  //     <SearchBar
  //       placeholder="Type Here..."
  //       lightTheme
  //       round
  //       onChangeText={this.handleSearch}
  //     />
  //   );
  // }

  // 리스트 항목을 누르면 호출되는 Method
  // Detail 창으로 이동, item 정보 전달

  // Pull to Refresh를 시도할 때 호출되는 Method
  // 데이터 20개를 다시 받는다.
  onRefresh = () => {
    this.setState({ data: getData(20) });
  };

  // 리스트의 내용을 출력할 때 호출되는 Method
  onRenderItem = ({ item }) => {
    return (
      <List.Item
        title={item.phonenumber}
        description={item.company}
        onPress={() => {
          this.props.navigation.navigate("Detail", { item });
        }}
        // TODO : 신용에 따라 맞춤 아이콘으로 적용하기
        left={props => <List.Icon color={item.color} icon="account" />}
      />
    );
  };

  // '검색' 탭에 표시되는 내용
  render() {
    return (
      <View>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={this.onRenderItem}
            keyExtractor={(item, key) => item.key}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={1}
            refreshing={this.state.refreshing}
            onRefresh={this.OonRefresh}
          ></FlatList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: "center",
    flex: 1,
    marginTop: 40,
    padding: 16
  },
  textStyle: {
    padding: 10
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#EF7777",
    backgroundColor: "#faeded"
  }
});
