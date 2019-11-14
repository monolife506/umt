import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Button, Headline, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// ScrollView가 끝에 근접했는지 확인하는 Method
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class TermsAndConditions extends Component {
  // 동의 상태 확인
  state = {
    scrolled: false
  };

  // '신고' 탭으로 이동하는 Method
  moveToReport = () => {
    this.props.navigation.navigate("Report");
  };

  // 네비게이터 옵션
  static navigationOptions = {
    header: null
  };

  // '신고' 탭에 표시되는 내용
  // 약관 내용은 누군가 써주세요
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container_warning}>
          <View style={styles.container_button}>
            <Headline style={styles.title}>이용 약관</Headline>
          </View>
          <MaterialCommunityIcons
            name="alert-octagon"
            color="#f04343"
            size={100}
          />
          <Card
            style={
              this.state.scrolled
                ? styles.container_scrollview_scrolled
                : styles.container_scrollview
            }
          >
            <ScrollView
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  this.setState({ scrolled: true });
                }
              }}
            >
              <Text style={styles.TextStyle}>
                1. 개인정보 수집 · 이용 동의서{"\n"}
                {"\n"}
                {"("}1{")"} 개인정보의 수집 · 이용 목적{"\n"}
                해커톤에 필요한 개인정보를 수집 · 이용하고자 함.{"\n"}
                {"\n"}
                {"("}2{")"} 수집하는 개인정보의 항목{"\n"}① 일반정보 – 성명,
                연락처, 이메일 등{"\n"}② 사회정보 – 학력사항, 자격사항, 경력사항
                등{"\n"}
                {"\n"}
                {"("}3{")"} 개인정보의 보유 및 활용 기간{"\n"}
                동의 일로부터 수집 · 이용 목적의 달성 시까지 보유 후 파기{"\n"}
                {"\n"}※ 개인정보 제공 및 이용에 거부할 권리가 있으며 그에 따른
                불이익이 있을 수 있습니다.{"\n"}※ 개인정보 제공자가 동의한 내용
                외에 다른 목적으로 활용하지 않으며, 제공된 개인정보를 변경하고자
                할 때에는 개인정보 {"\n"}
                관리책임자를 통해 열람, 정정을 요구할 수 있습니다.{"\n"}
                {"\n"}
                「개인정보보호법」, 「동법 시행령」, 「동법 시행규칙」에
                의거하여 본인의 개인정보를 위와 같이 수집 · 이용하는데
                동의합니다.{"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                2. 초상권 및 산출물 공유 동의서{"\n"}
                주최 측은 진행되는 '2019 인하 SW 해커톤'의 홍보와 대회현장
                기록을 위한 책자를 아래와 같이 제작하고자 합니다.{"\n"}○ 산출물
                공유{"\n"}- 해커톤 종료 후 발생한 산출물에 대한 공유{"\n"}○
                촬영내용{"\n"}- ‘2019 인하 SW 해커톤’ 대회 현장{"\n"}○ 활용처
                {"\n"}- 기업가센터의 활동 홍보 책자{"\n"}- 대회 결과 보고용 인쇄
                건{"\n"}- 대회진행에 있어 모든 기록 수집{"\n"}○ 진행사항{"\n"}-
                대회 기간 내 참여자 및 담당 운영자들의 활동 모습 기록{"\n"}-
                모든 촬영은 대회진행이나 활동에 전혀 지장을 주지 않는 선에서
                진행{"\n"}- 촬영된 사진이나 영상, 산출물은 비상업적인 용도로만
                사용될 것이며 어떠한 공적인 일에 사용하지 않음{"\n"}
                {"\n"}
                이에 다음의 사항에 대하여 ‘2019 인하 SW 해커톤’ 참여자 여러분의
                동의를 구합니다.{"\n"}
                {"\n"}
                {"("}1{")"} 초상이용 및 산출물 공유 동의서{"\n"}
                본인은 인하대학교를 비롯한 국가와 지방자치단체, 기타
                공공기관에서의 공익적 목적으로 운영하는 웹사이트 및 기타 간행{" "}
                {"\n"}물 등에 본인의 초상이 도화, 사진, 영상 등의 매체를 통해
                복제, 배포, 공중송신, 방송 기타의 방법으로 공개되거나 사용되는{" "}
                {"\n"}
                것에 동의합니다. 또한, 산출물에 대해서 대회 주관 측에 공유할
                것을 동의하며 이는 기록을 남기는 용도에만 사용됨을 약속{"\n"}
                드립니다.{"\n"}
                {"\n"}
                {"("}2{")"} 초상이용 동의서{"\n"}
                본인은 「개인정보보호법」 제 15조 제1항 등 관련 법규에 의거하여
                아래와 같은 개인정보 수집 및 활용에 동의합니다.{"\n"}① 수집하는
                개인정보의 항목 : 성명, 이메일, 소속, 전화번호, 학력{"\n"}②
                개인정보의 수집 이용목적 : 사진 촬영, 책자 제작, 초상이용 동의
                의사표시 확인{"\n"}③ 개인정보의 보유, 이용기간 : 동의서
                작성시부터 사용 목적이 종료되는 때까지 보관
              </Text>
            </ScrollView>
          </Card>
        </View>
        <View style={styles.container_button}>
          <Button
            mode="contained"
            disabled={!this.state.scrolled}
            onPress={() => this.moveToReport()}
            style={this.state.scrolled ? styles.button : styles.buttonDisabled}
          >
            <Text style={styles.buttonLabel}>약관에 동의합니다.</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 10
  },
  container_warning: {
    flex: 10,
    alignItems: "center"
  },

  container_button: {
    marginLeft: 10,
    marginRight: 10,
    flex: 2
  },

  container_scrollview: {
    marginTop: 20,
    flex: 15,
    padding: 5,
    borderColor: "#999",
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2
  },

  container_scrollview_scrolled: {
    marginTop: 20,
    flex: 15,
    padding: 5,
    borderColor: "#EF7777",
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2
  },

  title: {
    fontSize: 24,
    alignItems: "center",
    alignContent: "center",
    flex: 1
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
  },
  TextStyle: {
    fontSize: 24
  }
});
