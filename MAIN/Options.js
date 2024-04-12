import { useEffect, useState } from "react";
import {
  ButtonOne,
  Grid,
  Icon,
  SafeArea,
  SeparatedView,
  SideBySide,
  TextPill,
  TextView,
  getInDevice,
  height,
  layout,
  secondaryThemedBackgroundColor,
} from "../EVERYTHING/BAGEL/Things";
import { ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Options({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getInDevice("theme", setTheme);
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding]}>
        <TopFive title={"Select an option.."} />
      </View>
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal, layout.vertical]}>
           <Grid columns={4} gap={10}>
             {/* ORDERS */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("orders")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"documents-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Orders
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* SALES REPORT */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("sales-report")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"wallet-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Reports
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* MENU */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("menu")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"cafe-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Menu
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* REWARDS */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("rewards")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"star-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Rewards
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* SPECIALS */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("specials")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"pricetags-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Specials
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* UPDATES */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("updates")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"notifications-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                  Updates
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
          {/* SETTINGS */}
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={14}
            padding={height * 0.1}
            onPress={() => {navigation.navigate("settings")}}
          >
            <View style={[layout.center]}>
              <SideBySide>
                <Icon name={"settings-outline"} theme={theme} size={28} />
                <TextView theme={theme} size={28}>
                 Settings
                </TextView>
              </SideBySide>
            </View>
          </ButtonOne>
           </Grid>
        </View>
      </ScrollView>
    </SafeArea>
  );
}