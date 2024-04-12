import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  Grid,
  Icon,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  ShowMoreView,
  SideBySide,
  Spacer,
  TextAreaOne,
  TextFieldOne,
  TextView,
  firebase_CreateDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListenerOrdered,
  formatLongDate,
  function_PickImage,
  getInDevice,
  layout,
  randomString,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  sendPushNotification,
  storage_UploadImage,
  width,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";
import { Image } from "react-native";

export function Updates({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [progress, setProgress] = useState(0);
  const [updates, setUpdates] = useState([]);

  //
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function onSendUpdate() {
    // ALERT
    Alert.alert(
      "Create Update",
      `Are you sure you want to send this update? All customers will receive a notification of this new update.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "default",
          onPress: () => {
            firebase_GetAllDocuments(
              setFakeLoading,
              "Users",
              (users) => {
                console.log(users);
                for (var i = 0; i < users.length; i += 1) {
                  const userToken = users[i].Token;
                  if (userToken !== undefined) {
                    sendPushNotification(userToken, "New Update!", `${title}`);
                  }
                  if (i === users.length - 1) {
                    const imagePath = `Images/${randomString(12)}.jpg`;
                    storage_UploadImage(
                      setLoading,
                      image,
                      imagePath,
                      setProgress,
                      (finished) => {
                        if (finished) {
                          firebase_CreateDocument(
                            {
                              Title: title,
                              Text: text.replaceAll("\n", "jjj"),
                              ImagePath: imagePath,
                              Date: new Date(),
                            },
                            "Updates",
                            randomString(25)
                          ).then(() => {
                            //
                            setTitle("");
                            setText("");
                            setImage(null);
                          });
                        }
                      }
                    );
                  }
                }
              },
              0,
              "",
              "",
              "",
              false,
              null,
              null
            );
          },
        },
      ]
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    firebase_GetAllDocumentsListenerOrdered(
      setLoading,
      "Updates",
      setUpdates,
      50,
      "desc",
      "Date",
      "",
      "",
      "",
      false,
      null,
      null,
      () => {},
      () => {},
      () => {}
    );
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeArea loading={loading} theme={theme}>
        {/* TOP */}
        <View style={[layout.padding_horizontal]}>
          <SeparatedView>
            <SideBySide>
              <IconButtonTwo
                theme={theme}
                size={26}
                name={"arrow-back-outline"}
                onPress={() => {
                  navigation.navigate("options");
                }}
              />
              <TopFive
                title={"Updates"}
                caption={"Keep your customers updated."}
                theme={theme}
              />
            </SideBySide>
          </SeparatedView>
        </View>
        {/* BODY */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[layout.padding_horizontal]}>
            <Grid columns={2} gap={10}>
              {/* RIGHT */}
              <View>
                <TextView
                  theme={theme}
                  size={18}
                  styles={[layout.padding_vertical_small]}
                >
                  Choose a thumbnail image
                </TextView>
                <TouchableOpacity
                  style={[
                    { backgroundColor: secondaryThemedBackgroundColor(theme) },
                    layout.padding,
                    layout.fit_width,
                  ]}
                  onPress={() => {
                    function_PickImage(setLoading, setImage, image);
                  }}
                >
                  <Icon theme={theme} name={"add-outline"} size={60} />
                </TouchableOpacity>
                <Spacer height={10} />
                {image !== null && (
                  <Image
                    source={{ uri: image }}
                    style={[{ width: "50%", height: width * 0.25 }]}
                  />
                )}
                <Spacer height={10} />
                <TextView
                  theme={theme}
                  size={18}
                  styles={[layout.padding_vertical_small]}
                >
                  Title
                </TextView>
                <TextFieldOne
                  placeholder={"Type title here..."}
                  value={title}
                  setter={setTitle}
                  theme={theme}
                />
                <Spacer height={10} />
                <TextView
                  theme={theme}
                  size={18}
                  styles={[layout.padding_vertical_small]}
                >
                  Text
                </TextView>
                <TextAreaOne
                  theme={theme}
                  placeholder={"Type your update here..."}
                  value={text}
                  setter={setText}
                />
                <Spacer height={20} />
                {image !== null && text !== "" && title !== "" && (
                  <ButtonOne
                    backgroundColor={"#117DFA"}
                    radius={100}
                    onPress={() => {
                      onSendUpdate();
                    }}
                  >
                    <View style={[layout.padding_horizontal]}>
                      <TextView
                        theme={theme}
                        size={18}
                        color={"white"}
                        center={true}
                      >
                        Send Update
                      </TextView>
                    </View>
                  </ButtonOne>
                )}
              </View>
              {/* LEFT */}
              <View style={[layout.horizontal]}>
                <Grid columns={2} gap={10}>
                  {updates.map((update, i) => {
                    return (
                      <View key={i}>
                        <AsyncImage
                          path={
                            update.ImagePath !== undefined
                              ? update.ImagePath
                              : "Images/coffee.jpg"
                          }
                          width={"100%"}
                          height={width * 0.25}
                        />
                        <View style={[layout.padding_vertical_small]}>
                          <TextView theme={theme} size={22}>
                            {update.Title}
                          </TextView>
                          <TextView theme={theme} size={18} color={secondaryThemedTextColor(theme)}>
                            {formatLongDate(new Date(update.Date.seconds * 1000))}
                          </TextView>
                          <ShowMoreView height={100} theme={theme}>
                            <TextView
                              theme={theme}
                              size={16}
                              styles={[layout.padding_vertical]}
                            >
                              {update.Text.replaceAll("jjj", "\n")}
                            </TextView>
                          </ShowMoreView>
                        </View>
                      </View>
                    );
                  })}
                </Grid>
              </View>
            </Grid>
          </View>
          <Spacer height={60} />
        </ScrollView>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
