import React, { Component } from "react";
import {
  Platform,
  DatePickerIOS,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  DatePickerAndroid
} from "react-native";
import {
  Card,
  HelperText,
  TextInput,
  Button,
  Dialog,
  Portal,
  Provider,
  RadioButton
} from "react-native-paper";
import axios from 'axios';

export default class ReportTab extends Component {
  // 네비게이터 옵션
  static navigationOptions = {
    header: null
  };
  // States
  state = {
    input_phoneNumber: "",
    input_company: "",
    input_food: "한식",
    input_date: new Date(Date.now()),
    input_date_text: "훔친 날짜를 입력해 주세요",
    input_stealHistory: { food: "", date: "" },

    date_info: {},
    visible_companydialog: false,
    visible_fooddialog: false
  };

  // 회사 고르는 창 표시
  _showDialog_company = () => this.setState({ visible_companydialog: true });
  // 음식 고르는 창 표시
  _showDialog_food = () => this.setState({ visible_fooddialog: true });
  // 날짜 고르는 창 표시

  // 안드로이드
  _showDatePicker_android = async options => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open(
        options
      );
      if (action !== DatePickerAndroid.dismissedAction) {
        let date = new Date(year, month, day);
        let date_info = {};
        date_info["input_date"] = date;
        date_info["input_date_text"] = date.toLocaleDateString("ko-KR");
        this.setState(date_info);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };
  // 아이폰
  _showDatePicker_ios = () => {
    return (
      <View style={styles.container}>
        <DatePickerIOS
          date={this.state.input_date}
          onDateChange={newdate => this.setState({ input_date: newdate })}
        />
      </View>
    );
  };
  refactoring_date = () => {
    let arr = this.state.input_date_text.split('/');
    let res = "";
    res += arr[2] + '-';
    res += arr[0] + '-';
    res += arr[1];
    return res;
  };
  // 신고
  report = () => {
      axios.get('http://192.168.2.184:3000/api/report', {
          params: {
              phoneNumber: this.state.input_phoneNumber,
              affiliation: this.state.input_company,
              food: this.state.input_food,
              occuredTime: "20" + this.refactoring_date(this.state.input_date_text)
          }
      }).catch(err => {console.log(err)});
  };

  // 창 숨기기
  _hideDialog = () =>
    this.setState({ visible_companydialog: false, visible_fooddialog: false });

  // '신고' 탭에 표시되는 내용

  // 배달원 전화번호
  // 배달원이 근무하는 배달대행 업체
  // 배달원이 빼먹은 음식의 종류
  // 배달원이 음식을 빼먹은 날짜

  render() {
    String.prototype.isValidPhoneNumber = function() {
      return /^010-?([0-9]{3,4})-?([0-9]{4})$/.test(this);
    };

    return (
      <Provider>
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior="padding"
          keyboardVerticalOffset={80}
        >
          <Card style={styles.container}>
            <View style={styles.inputContainerStyle}>
              <TextInput
                style={styles.inputContainerStyle}
                label="배달원 전화번호"
                mode="outlined"
                selectionColor="#EF7777"
                underlineColorAndroid="#EF7777"
                value={this.state.input_phoneNumber}
                onChangeText={input =>
                  this.setState({ input_phoneNumber: input })
                }
              />
              <HelperText
                type=""
                visible={!this.state.input_phoneNumber.isValidPhoneNumber()}
              >
                010-####-####의 형식으로 입력해 주세요.
              </HelperText>
            </View>
            <View style={styles.inputContainerStyle_inside}>
              <TextInput
                style={styles.infoContainerStyle}
                label="소속 배달대행 업체"
                mode="outlined"
                disabled={true}
                value={this.state.input_company}
              />
              <Button
                style={styles.infoButtonStyle}
                labelStyle={styles.ButtonText}
                color="#EF7777"
                mode="text"
                onPress={this._showDialog_company}
              >
                선택
              </Button>
            </View>
            <View style={styles.inputContainerStyle_inside}>
              <TextInput
                style={styles.infoContainerStyle}
                label="빼먹은 음식 종류"
                mode="outlined"
                disabled={true}
                value={this.state.input_food}
              />
              <Button
                style={styles.infoButtonStyle}
                labelStyle={styles.ButtonText}
                color="#EF7777"
                mode="text"
                onPress={this._showDialog_food}
              >
                선택
              </Button>
            </View>
            <View style={styles.inputContainerStyle_inside}>
              <TextInput
                style={styles.infoContainerStyle}
                label="음식을 훔친 날짜"
                mode="outlined"
                disabled={true}
                value={this.state.input_date_text}
              />
              <Button
                style={styles.infoButtonStyle}
                labelStyle={styles.ButtonText}
                color="#EF7777"
                mode="text"
                onPress={() =>
                  this._showDatePicker_android({ date: this.state.input_date })
                }
              >
                선택
              </Button>
            </View>
            <View style={styles.inputContainerStyle_inside}></View>
            <View style={styles.inputContainerStyle_inside_button}>
              <Button
                mode="contained"
                disabled={
                  !this.state.input_phoneNumber.isValidPhoneNumber() ||
                  this.state.input_date_text === "훔친 날짜를 입력해 주세요"
                }
                style={
                  this.state.input_phoneNumber.isValidPhoneNumber() &&
                  this.state.input_date_text !== "훔친 날짜를 입력해 주세요"
                    ? styles.button
                    : styles.buttonDisabled
                }
                onPress={() => this.report()}
              >
                <Text style={styles.buttonLabel}>신고</Text>
              </Button>
            </View>
          </Card>

          <Portal>
            <Dialog
              visible={this.state.visible_companydialog}
              onDismiss={this._hideDialog}
            >
              <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={styles.dialogBox}>
                  <RadioButton.Group
                    onValueChange={value =>
                      this.setState({ input_company: value })
                    }
                    value={this.state.input_company}
                  >
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>바로고 (BAROGO)</Text>
                      <RadioButton value="1" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>배달요 (BAEDALYO)</Text>
                      <RadioButton value="2" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>리드콜 (LEADCALL)</Text>
                      <RadioButton value="3" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>모아콜 (MOACALL)</Text>
                      <RadioButton value="4" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>부릉 (VROONG)</Text>
                      <RadioButton value="5" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>배민라이더스</Text>
                      <RadioButton value="6" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>기타</Text>
                      <RadioButton value="7" color="#EF7777" />
                    </View>
                  </RadioButton.Group>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={this._hideDialog} color="#EF7777">
                  확인
                </Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog
              visible={this.state.visible_fooddialog}
              onDismiss={this._hideDialog}
            >
              <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={styles.dialogBox}>
                  <RadioButton.Group
                    onValueChange={value =>
                      this.setState({ input_food: value })
                    }
                    value={this.state.input_food}
                  >
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>한식</Text>
                      <RadioButton value="한식" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>분식</Text>
                      <RadioButton value="분식" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>카페/디저트</Text>
                      <RadioButton value="카페/디저트" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>일식 (돈가스, 회)</Text>
                      <RadioButton value="일식" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>치킨</Text>
                      <RadioButton value="치킨" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>피자</Text>
                      <RadioButton value="피자" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>
                        아시안 (쌀국수 등 동남아시아 요리)
                      </Text>
                      <RadioButton value="아시안" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>양식</Text>
                      <RadioButton value="양식" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>중국집</Text>
                      <RadioButton value="중국집" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>족발/보쌈</Text>
                      <RadioButton value="족발/보쌈" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>
                        야식 (닭발, 오돌뼈, 곱창)
                      </Text>
                      <RadioButton value="야식" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>찜/탕</Text>
                      <RadioButton value="찜/탕" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>도시락</Text>
                      <RadioButton value="도시락" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>패스트푸드</Text>
                      <RadioButton value="패스트푸드" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>기타</Text>
                      <RadioButton value="기타" color="#EF7777" />
                    </View>
                  </RadioButton.Group>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={this._hideDialog} color="#EF7777">
                  확인
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </KeyboardAvoidingView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },

  container: {
    flex: 1,
    padding: 8,
    margin: 10
  },

  inputContainerStyle: {
    margin: 8
  },

  infoContainerStyle: {
    margin: 8,
    flexBasis: "75%"
  },

  infoButtonStyle: {
    margin: 8,
    flexBasis: "15%",
    justifyContent: "center"
  },

  inputContainerStyle_inside: {
    flexDirection: "row",
    margin: 8
  },

  inputContainerStyle_inside_button: {
    flexDirection: "row-reverse",
    margin: 8
  },

  ButtonText: {
    color: "#EF7777"
  },

  dialogBox: {
    paddingHorizontal: 2,
    paddingVertical: 10
  },

  dialogContainer: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  dialogText: {
    fontSize: 15
  },

  button: {
    backgroundColor: "#EF7777"
  },

  buttonDisabled: {
    backgroundColor: "#999"
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center"
  }
});
