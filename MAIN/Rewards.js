import { useEffect, useState } from "react";
import {
  ButtonOne,
  DropdownOne,
  Grid,
  IconButtonOne,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextFieldOne,
  TextView,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  format,
  getInDevice,
  layout,
  randomString,
  removeDuplicates,
  secondaryThemedBackgroundColor,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Rewards({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  //
  const [me, setMe] = useState({});

  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);

  //
  const [category, setCategory] = useState("Select One");
  const [points, setPoints] = useState("");

  function onCreateReward() {
    setLoading(true);
    firebase_CreateDocument(
      {
        Category: category,
        Points: points,
      },
      `Rewards-${me.id}`,
      randomString(25)
    ).then(() => {
      setLoading(false);
      setCategory("Select One");
      setPoints("");
    });
  }
  function onRemoveReward(reward) {
    Alert.alert(
      "Remove Reward",
      "Are you sure you want to remove this reward?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            firebase_DeleteDocument(setLoading, `Rewards-${me.id}`, reward.id);
          },
        },
      ]
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocumentsListener(
        setLoading,
        `Rewards-${person.id}`,
        setRewards,
        0,
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
      firebase_GetAllDocuments(
        setLoading,
        `Items-${person.id}`,
        (items) => {
          const tempArr = removeDuplicates(
            items.map((ting) => {
              return ting.Category;
            })
          );
          setCategories(tempArr);
        },
        0,
        "",
        "",
        "",
        false,
        null,
        null
      );
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <View style={[layout.padding_horizontal]}>
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
            title={"Rewards"}
            caption={"Manage your point system."}
            theme={theme}
          />
        </SideBySide>
      </View>
      <Spacer height={10} />
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            layout.padding_horizontal,
            { backgroundColor: secondaryThemedBackgroundColor(theme) },
            layout.fit_width,
            layout.padding,
            layout.margin_horizontal,
            format.radius,
          ]}
        >
          <View
            style={[{ flexDirection: "row", alignItems: "flex-end", gap: 12 }]}
          >
            <View style={[{ width: 300 }]}>
              <TextView theme={theme} styles={[layout.padding_vertical_small]}>
                Category
              </TextView>
              <DropdownOne
                options={[
                  "Select One",
                  ...categories
                    .map((ting) => ting)
                    .filter(
                      (ting) =>
                        !rewards
                          .map((thing) => {
                            return thing.Category;
                          })
                          .includes(ting)
                    ),
                ]}
                value={category}
                setter={setCategory}
                theme={theme}
                textSize={14}
                padding={14}
              />
            </View>
            <View style={[{ width: 300 }]}>
              <TextView theme={theme} styles={[layout.padding_vertical_small]}>
                Amount of Points
              </TextView>
              <TextFieldOne
                placeholder={"# of points"}
                isNum={true}
                value={points}
                setter={setPoints}
                paddingV={10}
                theme={theme}
              />
            </View>
            <View>
              <ButtonOne
                backgroundColor={"#1BA8FF"}
                radius={100}
                onPress={() => {
                  onCreateReward();
                }}
              >
                <TextView theme={theme} color={"white"}>
                  Create Reward
                </TextView>
              </ButtonOne>
            </View>
          </View>
        </View>

        {/* MAP */}
        <View style={[layout.padding, layout.vertical]}>
          {rewards.map((reward, i) => {
            return (
              <View key={i} style={[{ maxWidth: 500 }]}>
                <SeparatedView>
                  <View>
                    <TextView theme={theme} size={24}>
                      {reward.Category}
                    </TextView>
                    <TextView theme={theme} color={"#1BA8FF"} size={18}>
                      {reward.Points} points for free item
                    </TextView>
                  </View>
                  <IconButtonOne
                    name={"remove-circle-outline"}
                    lightColor={"red"}
                    darkColor={"red"}
                    size={26}
                    onPress={() => {
                      onRemoveReward(reward);
                    }}
                  />
                </SeparatedView>
              </View>
            );
          })}
        </View>

        <Spacer height={50} />
      </ScrollView>
    </SafeArea>
  );
}
