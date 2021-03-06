import React, { Component } from "react";
import {
  Platform,
  DatePickerIOS,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  DatePickerAndroid,
} from "react-native";
import {
  Card,
  HelperText,
  TextInput,
  Button,
  Dialog,
  Portal,
  Provider,
  RadioButton,
  Snackbar,
} from "react-native-paper"; // Material design 구현
import axios from "axios"; // 서버에 데이터 전송

export default class ReportTab extends Component {
  // 네비게이터 옵션
  static navigationOptions = {
    header: null, // 이중 헤더 표시 방지
  };
  // States
  state = {
    input_phoneNumber: "", // 음식을 훔친 배달부의 휴대폰 번호
    input_company: "바로고", // 배달부의 배달 대행 업체 소속
    input_food: "한식", // 빼앗긴 음식의 종류
    input_date: new Date(Date.now()), // 음식을 빼앗긴 날짜
    input_date_text: "훔친 날짜를 입력해 주세요", // 음식을 빼앗긴 날짜, String 형식 (정보 전달에 사용됨)

    visible_companydialog: false, // 배달 대행 업체를 선택하는 Dialog 표시
    visible_fooddialog: false, // 빼앗긴 음식의 종류를 선택하는 Dialog 표시
    visible_snackbar_done: false, // 신고에 성공하면 Snackbar 표시
    visible_snackbar_error: false, // 신고 도중 오류가 발생한 경우 Snackbar 표시
  };

  // 회사 고르는 창 표시
  _showDialog_company = () => this.setState({ visible_companydialog: true });
  // 음식 고르는 창 표시
  _showDialog_food = () => this.setState({ visible_fooddialog: true });

  // 날짜 고르는 창 표시
  // 안드로이드
  _showDatePicker_android = async options => {
    try {
      // 안드로이드에 내장된 Datepicker open
      const { action, year, month, day } = await DatePickerAndroid.open(options);
      if (action !== DatePickerAndroid.dismissedAction) {
        // Datepicker가 닫히지 않은 경우
        let date = new Date(year, month, day);
        let date_info = {};
        date_info["input_date"] = date;
        date_info["input_date_text"] = date.toLocaleDateString("ko-KR"); // 안드로이드에서는 적용되지 않음
        this.setState(date_info); // date_info === {input_date: date, input_date_text: date.toLocaleDateString("ko-KR")}
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message); // 오류 발생시 메세지 출력
    }
  };
  // 아이폰
  // 아이폰에 내장된 Datepicker를 표시하는 Dialog open
  _showDialog_Datepicker_ios = () => this.setState({ visible_datedialog_ios: true });
  // 아이폰 Datepicker
  _setDate_ios = newDate =>
    this.setState({
      input_date: newDate,
      input_date_text: newDate.toLocaleDateString("ko-KR"),
    });

  // 안드로이드와 IOS에서 날짜 포멧이 다르게 저장되므로, 포멧을 동일하게 함
  // 플랫폼 구별하여 리팩토링
  _distinguish_flatForm = () => {
    if (Platform.OS === "android") {
      return this.refactoring_date_android();
    } else {
      return this.refactoring_date_ios();
    }
  };
  refactoring_date_android = () => {
    let arr = this.state.input_date_text.split("/");
    let res = "";
    res += arr[2] + "-";
    res += arr[0] + "-";
    res += arr[1];
    res = "20" + res;
    return res;
  };
  refactoring_date_ios = () => {
    let arr = this.state.input_date_text.split(".");
    let res = "";
    res += arr[0].trim() + "-";
    res += arr[1].trim() + "-";
    res += arr[2].trim();

    console.log(res);
    return res;
  };

  // 신고
  report = () => {
    axios // 입력된 정보 전송
      .get("http://192.168.0.10:3000/api/report", {
        params: {
          phoneNumber: this.state.input_phoneNumber,
          affiliation: this.refactoring_affiliation(this.state.input_company),
          food: this.state.input_food,
          occuredTime: this._distinguish_flatForm(),
        },
      })
      .then(() => this.setState({ visible_snackbar_done: true })) // 전송 성공
      .catch(err => {
        console.log(err);
        this.setState({ visible_snackbar_error: true }); // 전송 실패
      });
  };
  // 신고할 때 회사 이름을 바꿀 때 사용
  refactoring_affiliation = value => {
    const arr = [0, "바로고", "배달요", "리드콜", "모아콜", "부릉", "배민라이더스", "기타"];
    console.log(arr.indexOf(value)); // 숫자로만 회사 표현
    return arr.indexOf(value);
  };

  // 창 숨기기
  _hideDialog = () =>
    this.setState({
      visible_companydialog: false,
      visible_fooddialog: false,
      visible_datedialog_ios: false,
    });

  // '신고' 탭에 표시되는 내용

  // 배달원 전화번호
  // 배달원이 근무하는 배달대행 업체
  // 배달원이 빼먹은 음식의 종류
  // 배달원이 음식을 빼먹은 날짜

  render() {
    // 정규표현식을 이용해 휴대폰 입력이 제대로 되었는지 확인
    String.prototype.isValidPhoneNumber = function() {
      return /^010-?([0-9]{8})$/.test(this);
    };

    return (
      <Provider>
        <KeyboardAvoidingView style={styles.wrapper} behavior="padding" keyboardVerticalOffset={80}>
          <Card style={styles.container}>
            <View style={styles.inputContainerStyle}>
              <TextInput
                style={styles.inputContainerStyle}
                label="배달원 전화번호"
                mode="outlined"
                selectionColor="#EF7777"
                underlineColorAndroid="#EF7777"
                value={this.state.input_phoneNumber}
                onChangeText={input => this.setState({ input_phoneNumber: input })}
              />
              <HelperText type="" visible={!this.state.input_phoneNumber.isValidPhoneNumber()}>
                010########의 형식으로 입력해 주세요.
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
                onPress={
                  Platform.OS === "android"
                    ? () =>
                        this._showDatePicker_android({
                          date: this.state.input_date,
                        })
                    : () => this._showDialog_Datepicker_ios()
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
            <Dialog visible={this.state.visible_companydialog} onDismiss={this._hideDialog}>
              <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={styles.dialogBox}>
                  <RadioButton.Group
                    onValueChange={value => this.setState({ input_company: value })}
                    value={this.state.input_company}
                  >
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>바로고 (BAROGO)</Text>
                      <RadioButton value="바로고" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>배달요 (BAEDALYO)</Text>
                      <RadioButton value="배달요" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>리드콜 (LEADCALL)</Text>
                      <RadioButton value="리드콜" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>모아콜 (MOACALL)</Text>
                      <RadioButton value="모아콜" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>부릉 (VROONG)</Text>
                      <RadioButton value="부릉" color="#EF7777" />
                    </View>
                    <View style={styles.dialogContainer}>
                      <Text style={styles.dialogText}>배민라이더스</Text>
                      <RadioButton value="배민라이더스" color="#EF7777" />
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
            <Dialog visible={this.state.visible_fooddialog} onDismiss={this._hideDialog}>
              <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={styles.dialogBox}>
                  <RadioButton.Group
                    onValueChange={value => this.setState({ input_food: value })}
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
                      <Text style={styles.dialogText}>아시안 (쌀국수 등 동남아시아 요리)</Text>
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
                      <Text style={styles.dialogText}>야식 (닭발, 오돌뼈, 곱창)</Text>
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
            <Dialog
              visible={this.state.visible_datedialog_ios}
              onDismiss={this._hideDialog}
              style={styles.dateDialogContainer}
            >
              <Dialog.Content style={styles.dateDialogContainer}>
                <DatePickerIOS
                  style={styles.dateDialogContainer}
                  date={this.state.input_date}
                  onDateChange={this._setDate_ios}
                  mode={"date"}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  labelStyle={styles.ButtonText_Datepicker_ios}
                  onPress={this._hideDialog}
                  color="#EF7777"
                >
                  확인
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Snackbar
            visible={this.state.visible_snackbar_done}
            onDismiss={() => this.setState({ visible_snackbar_done: false })}
          >
            신고가 접수되었습니다.
          </Snackbar>
          <Snackbar
            visible={this.state.visible_snackbar_error}
            onDismiss={() => this.setState({ visible_snackbar_error: false })}
          >
            전송 중에 오류가 발생했습니다.
          </Snackbar>
        </KeyboardAvoidingView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 8,
    margin: 10,
  },

  inputContainerStyle: {
    margin: 8,
  },

  infoContainerStyle: {
    margin: 8,
    flexBasis: "75%",
  },

  infoButtonStyle: {
    margin: 8,
    flexBasis: "15%",
    justifyContent: "center",
  },

  inputContainerStyle_inside: {
    flexDirection: "row",
    margin: 8,
  },

  inputContainerStyle_inside_button: {
    flexDirection: "row-reverse",
    margin: 8,
  },

  ButtonText: {
    color: "#EF7777",
  },

  ButtonText_Datepicker_ios: {
    color: "#EF7777",
    fontSize: 25,
  },

  dialogBox: {
    paddingHorizontal: 2,
    paddingVertical: 10,
  },

  dialogContainer: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateDialogContainer: {
    flex: 1,
    justifyContent: "center",
  },

  dialogText: {
    fontSize: 15,
  },

  button: {
    backgroundColor: "#EF7777",
  },

  buttonDisabled: {
    backgroundColor: "#999",
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
});
