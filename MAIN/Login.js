import { useEffect, useState } from "react";
import {
  ButtonOne,
  SafeArea,
  TextFieldOne,
  TextView,
  auth_IsUserSignedIn,
  auth_SignIn,
  getInDevice,
  layout,
  secondaryThemedBackgroundColor,
  setInDevice,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { TopFive } from "../SCREEN_COMPONENTS/Top";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

export function Login({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");

  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSignIn() {
    setLoading(true);
    auth_SignIn(
      setLoading,
      email,
      password,
      navigation,
      null,
      "options",
      (person) => {
        if (person.Role !== "Admin" || person.Role === undefined) {
          // NOT ADMIN
          navigation.navigate("login");
          Alert.alert(
            "Invalid Login",
            "We're sorry. This email is not authorized to login on this app."
          );
        } else {
          setInDevice("user", person);
        }
      }
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    setLoading(true)
    auth_IsUserSignedIn(setLoading, navigation, "options", "login", null, (person) => {
      if (person.Role !== "Admin" || person.Role === undefined) {
        // NOT ADMIN
        navigation.navigate("login");
        Alert.alert(
          "Invalid Login",
          "We're sorry. This email is not authorized to login on this app."
        );
      } else {
        setInDevice("user", person);
      }
    })
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        {/* TOP */}
        <TopFive
          theme={theme}
          title={"Coffeeshop Log In"}
          caption={"Use your assigned email and password to log in."}
        />

        {/* BODY */}
        <View style={[layout.separate_vertical]}>
          <View></View>
          <View style={[layout.separate_horizontal]}>
            <View></View>
            <View style={[{ width: width * 0.5 }, layout.vertical]}>
              <View>
                <TextView
                  theme={theme}
                  size={20}
                  styles={[layout.padding_vertical_small]}
                >
                  Email
                </TextView>
                <TextFieldOne
                  theme={theme}
                  placeholder={"jdoe@coffeeshop.com"}
                  value={email}
                  setter={setEmail}
                />
              </View>
              <View>
                <TextView
                  theme={theme}
                  size={20}
                  styles={[layout.padding_vertical_small]}
                >
                  Password
                </TextView>
                <TextFieldOne
                  theme={theme}
                  placeholder={"********"}
                  value={password}
                  setter={setPassword}
                  isPassword={true}
                />
              </View>
              <View style={[layout.center]}>
                <ButtonOne
                  backgroundColor={"#117DFA"}
                  radius={100}
                  onPress={onSignIn}
                >
                  <View style={[layout.padding_horizontal]}>
                    <TextView theme={theme} size={22}>
                      Log In
                    </TextView>
                  </View>
                </ButtonOne>
              </View>
            </View>
            <View></View>
          </View>
          <View></View>
        </View>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
