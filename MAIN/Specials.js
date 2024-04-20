import { useEffect, useState } from "react";
import {
  ButtonOne,
  DatePicker,
  DropdownOne,
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
  formatDate,
  getInDevice,
  layout,
  randomString,
  secondaryThemedBackgroundColor,
  themedBackgroundColor,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Specials({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  //
  const [me, setMe] = useState({});

  const [items, setItems] = useState([]);
  const [chosenItem, setChosenItem] = useState("Select One");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [percentage, setPercentage] = useState("");
  const [specials, setSpecials] = useState([]);

  function onCreateSpecial() {
    setLoading(true);
    const args = {
      ItemID: items.find((ting) => ting.Name === chosenItem).id,
      StartDate: new Date(startDate),
      EndDate: new Date(endDate),
      Percentage: parseInt(percentage),
    };

    firebase_CreateDocument(args, `Specials-${me.id}`, randomString(25)).then(() => {
      setStartDate(new Date());
      setEndDate(new Date());
      setPercentage("");
      setChosenItem("Select One");
      setLoading(false);
    });
  }
  function onRemoveSpecial(special) {
    Alert.alert(
      "Remove Special",
      "Are you sure you want to remove this special?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            firebase_DeleteDocument(setLoading, `Specials-${me.id}`, special.id);
          },
        },
      ]
    );
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocuments(
        setLoading,
        `Items-${person.id}`,
        setItems,
        0,
        "",
        "",
        "",
        false,
        null,
        null
      );
      firebase_GetAllDocumentsListener(
        setLoading,
        `Specials-${person.id}`,
        setSpecials,
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
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
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
            title={"Specials"}
            caption={"Manage your timed specials."}
            theme={theme}
          />
        </SideBySide>
      </View>
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            layout.margin,
            { backgroundColor: secondaryThemedBackgroundColor(theme) },
            layout.padding,
            format.radius,
          ]}
        >
          <View
            style={[layout.horizontal, { gap: 14, alignItems: "flex-end" }]}
          >
            <View style={[{ width: 400 }]}>
              <TextView theme={theme} size={22}>Item</TextView>
              <DropdownOne
                options={[
                  "Select One",
                  ...items.map((ting) => {
                    return ting.Name;
                  }),
                ]}
                value={chosenItem}
                setter={setChosenItem}
                textSize={24}
                padding={14}
              />
            </View>
            <View style={[{ width: 250 }]}>
              <TextView theme={theme} size={22} styles={[layout.padding_vertical_small]}>
                Start Date
              </TextView>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                theme={theme}
                lightBackgroundColor={themedBackgroundColor(theme)}
                darkBackgroundColor={themedBackgroundColor(theme)}
                textSize={24}
                padding={14}
              />
            </View>
            <View style={[{ width: 250 }]}>
              <TextView theme={theme} size={22} styles={[layout.padding_vertical_small]}>
                End Date
              </TextView>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                theme={theme}
                lightBackgroundColor={themedBackgroundColor(theme)}
                darkBackgroundColor={themedBackgroundColor(theme)}
                textSize={24}
                padding={14}
              />
            </View>
            <View style={[{ width: 250 }]}>
              <TextView theme={theme} size={22} styles={[layout.padding_vertical_small]}>
                Discount Percentage
              </TextView>
              <TextFieldOne
                theme={theme}
                placeholder={"%"}
                isNum={true}
                value={percentage}
                setter={setPercentage}
                textSize={24}
                paddingV={14}
              />
            </View>
            
          </View>
          <SeparatedView>
            <View></View>
            <View style={[{ width: 350 }]}>
            <Spacer height={20} />
              {chosenItem !== "Select One" && percentage !== "" && (
                <ButtonOne
                  backgroundColor={"#1BA8FF"}
                  radius={100}
                  onPress={onCreateSpecial}
                >
                  <TextView theme={theme} color={"white"} size={22} center={true}>
                    Create Special
                  </TextView>
                </ButtonOne>
              )}
            </View>
          </SeparatedView>
        </View>
        <View>
          <View style={[layout.padding]}>
            {specials.length > 0 &&
              specials.map((special, i) => {
                return (
                  <View key={i} style={[{ width: 650 }]}>
                    <SeparatedView>
                      <View>
                        <TextView theme={theme} size={26}>
                          {special.Percentage}% OFF -{" "}
                          {
                            items.find((ting) => ting.id === special.ItemID)
                              .Name
                          }
                        </TextView>
                        <TextView theme={theme} size={22}>
                          {formatDate(
                            new Date(special.StartDate.seconds * 1000)
                          )}{" "}
                          -{" "}
                          {formatDate(new Date(special.EndDate.seconds * 1000))}
                        </TextView>
                      </View>
                      <IconButtonOne
                        name={"remove-circle-outline"}
                        lightColor={"red"}
                        darkColor={"red"}
                        size={40}
                        onPress={() => {
                          onRemoveSpecial(special);
                        }}
                      />
                    </SeparatedView>
                  </View>
                );
              })}
          </View>
        </View>
        <Spacer height={50} />
      </ScrollView>
    </SafeArea>
  );
}
