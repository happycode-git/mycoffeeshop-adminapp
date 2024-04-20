import { useEffect, useState } from "react";
import {
  ButtonOne,
  CSVtoJSONConverterView,
  Grid,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  SwitchOne,
  TextFieldOne,
  TextView,
  TimePicker,
  firebase_CreateDocument,
  firebase_GetDocument,
  firebase_UpdateDocument,
  getInDevice,
  layout,
  randomString,
  removeDuplicatesByProperty,
  secondaryThemedBackgroundColor,
  setInDevice,
} from "../EVERYTHING/BAGEL/Things";
import { Alert, ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Settings({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({})
  //
  const [points, setPoints] = useState("");
  const [tax, setTax] = useState("");
  const [maxPoints, setMaxPoints] = useState(0);
  const [toggleTheme, setToggleTheme] = useState(false);
  //
  function onUploadCSV(data) {
    setLoading(true);
    const uniqueArr = removeDuplicatesByProperty(data, "Item Name");
    for (var i = 0; i < uniqueArr.length; i += 1) {
      const row = uniqueArr[i];
      const itemID = row.Token;
      const newObj = {
        Name: row["Item Name"],
        Category: row.Category,
        Price: row.Price !== "" ? parseFloat(row.Price) : 0,
        Description: row.Description,
        ImagePath: `Images/coffee.jpg`,
        Options: [
          ...data
            .filter((ting) => ting["Item Name"] === row["Item Name"])
            .map((ting) => {
              return {
                id: randomString(25),
                SubCategory:
                  ting["Variation Name"] === "Mini" ||
                  ting["Variation Name"] === "Small" ||
                  ting["Variation Name"] === "Medium" ||
                  ting["Variation Name"] === "Regular" ||
                  ting["Variation Name"] === "Large"
                    ? "Size"
                    : "Extras",
                Amount: 0,
                Name: ting["Variation Name"],
                ShowOptionAmount: false,
                Required: ting["Variation Name"] === "Mini" ||
                ting["Variation Name"] === "Small" ||
                ting["Variation Name"] === "Medium" ||
                ting["Variation Name"] === "Regular" ||
                ting["Variation Name"] === "Large"
                  ? true : false,
                AllowMultiple: ting["Variation Name"] === "Mini" ||
                ting["Variation Name"] === "Small" ||
                ting["Variation Name"] === "Medium" ||
                ting["Variation Name"] === "Regular" ||
                ting["Variation Name"] === "Large"
                  ? false : true,
              };
            }),
        ],
      };
      firebase_CreateDocument(newObj, "Items", itemID);
      if (i === uniqueArr.length - 1) {
        setLoading(false);
      }
    }
  }
  //
  //  #region HOURS
  const [mondayStart, setMondayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [mondayEnd, setMondayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [tuesdayStart, setTuesdayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [tuesdayEnd, setTuesdayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [wednesdayStart, setWednesdayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [wednesdayEnd, setWednesdayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [thursdayStart, setThursdayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [thursdayEnd, setThursdayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [fridayStart, setFridayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [fridayEnd, setFridayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [saturdayStart, setSaturdayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [saturdayEnd, setSaturdayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  const [sundayStart, setSundayStart] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [sundayEnd, setSundayEnd] = useState(
    new Date(new Date().setHours(18, 0, 0, 0))
  );
  //  #endregion

  function onUpdate() {
    setLoading(true);
    const daysOfTheWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (let i = 0; i < daysOfTheWeek.length; i++) {
      const day = daysOfTheWeek[i];
      let start, end;

      switch (day) {
        case "Monday":
          start = mondayStart;
          end = mondayEnd;
          break;
        case "Tuesday":
          start = tuesdayStart;
          end = tuesdayEnd;
          break;
        case "Wednesday":
          start = wednesdayStart;
          end = wednesdayEnd;
          break;
        case "Thursday":
          start = thursdayStart;
          end = thursdayEnd;
          break;
        case "Friday":
          start = fridayStart;
          end = fridayEnd;
          break;
        case "Saturday":
          start = saturdayStart;
          end = saturdayEnd;
          break;
        case "Sunday":
          start = sundayStart;
          end = sundayEnd;
          break;
        default:
          start = null;
          end = null;
          break;
      }

      if (start !== null && end !== null) {
        firebase_CreateDocument(
          {
            Start: start,
            End: end,
          },
          `Hours-${me.id}`,
          day
        );
      }
    }

    firebase_UpdateDocument(setLoading, `Settings-${me.id}`, "settings", {
      PointsPerDollar: parseInt(points),
      Tax: parseFloat(tax),
    }).then(() => {
      Alert.alert("Success", "Your changes have been saved.");
    });
  }

  useEffect(() => {
    getInDevice("theme", (thisTheme) => {
      setTheme(thisTheme);
      setToggleTheme(thisTheme === "light" ? true : false);
    });
    
    getInDevice("user", (person) => {
      setMe(person)
      firebase_GetDocument(setLoading, `Settings-${person.id}`, "settings", (thing) => {
        setPoints(`${thing.PointsPerDollar}`);
        setTax(`${thing.Tax}`);
        setMaxPoints(`${thing.MaxPoints}`);
      });
    })
  }, []);

  return (
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
              title={"Settings"}
              caption={"Manage your settings."}
              theme={theme}
            />
          </SideBySide>
          <ButtonOne
            backgroundColor={"#1BA8FF"}
            radius={100}
            onPress={() => {
              onUpdate();
            }}
          >
            <View style={[layout.padding_horizontal]}>
              <TextView size={22} theme={theme} color={"white"}>
                Update
              </TextView>
            </View>
          </ButtonOne>
        </SeparatedView>
      </View>
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal, layout.vertical]}>
          <Grid columns={2} gap={15}>
            <View>
              <View style={[{ width: 350 }]}>
                <TextView
                  theme={theme}
                  size={22}
                  styles={[layout.padding_vertical_small]}
                >
                  Points Per Dollar
                </TextView>
                <TextFieldOne
                  theme={theme}
                  placeholder={"# of points"}
                  value={points}
                  setter={setPoints}
                  isNum={true}
                  textSize={24}
                  paddingV={14}
                />
              </View>
              <View style={[{ width: 350 }]}>
                <TextView
                  theme={theme}
                  size={22}
                  styles={[layout.padding_vertical_small]}
                >
                  Tax Percentage
                </TextView>
                <TextFieldOne
                  theme={theme}
                  placeholder={"% tax"}
                  value={tax}
                  setter={setTax}
                  isNum={true}
                  textSize={24}
                  paddingV={14}
                />
              </View>
              <View style={[{ width: 350 }]}>
                <View style={[layout.padding_vertical_small]}>
                  <TextView theme={theme} size={22}>
                    Max Points
                  </TextView>
                  <TextView theme={theme} size={20}>
                    Set the maximum number of points a customer should be able
                    to accumulate. Set to 0 if there is no limit.
                  </TextView>
                </View>
                <TextFieldOne
                  theme={theme}
                  placeholder={"max # of points"}
                  value={maxPoints}
                  setter={setMaxPoints}
                  isNum={true}
                  textSize={24}
                  paddingV={14}
                />
              </View>
            </View>
            <View>
              <View>
                <TextView theme={theme} size={22}>
                  Theme
                </TextView>
                <SideBySide>
                  <TextView theme={theme} size={26}>Dark</TextView>
                  <SwitchOne
                    theme={theme}
                    toggledOffColor={secondaryThemedBackgroundColor(theme)}
                    value={toggleTheme}
                    setter={(value) => {
                      setToggleTheme(value);
                      getInDevice("theme", (thisTheme) => {
                        setTheme(thisTheme === "light" ? "dark" : "light");
                        setInDevice(
                          "theme",
                          thisTheme === "light" ? "dark" : "light"
                        );
                      });
                    }}
                  />
                  <TextView theme={theme} size={26}>Light</TextView>
                </SideBySide>
              </View>
              <View style={[layout.padding_vertical_small]}>
                <TextView theme={theme} size={22}>
                  Shop Hours
                </TextView>
                <TextView theme={theme} size={20}>
                  Set your shop hours so customers wont create orders while the
                  shop is closed.
                </TextView>
              </View>
              {/* DAYS OF THE WEEK */}
              <View style={[{ gap: 6 }]}>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Monday
                  </TextView>
                  <TimePicker
                    time={mondayStart}
                    setTime={setMondayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={mondayEnd}
                    setTime={setMondayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Tuesday
                  </TextView>
                  <TimePicker
                    time={tuesdayStart}
                    setTime={setTuesdayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={tuesdayEnd}
                    setTime={setTuesdayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Wednesday
                  </TextView>
                  <TimePicker
                    time={wednesdayStart}
                    setTime={setWednesdayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={wednesdayEnd}
                    setTime={setWednesdayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Thursday
                  </TextView>
                  <TimePicker
                    time={thursdayStart}
                    setTime={setThursdayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={thursdayEnd}
                    setTime={setThursdayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Friday
                  </TextView>
                  <TimePicker
                    time={fridayStart}
                    setTime={setFridayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={fridayEnd}
                    setTime={setFridayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Saturday
                  </TextView>
                  <TimePicker
                    time={saturdayStart}
                    setTime={setSaturdayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={saturdayEnd}
                    setTime={setSaturdayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
                <SideBySide>
                  <TextView theme={theme} size={22} color={"#117DFA"}>
                    Sunday
                  </TextView>
                  <TimePicker
                    time={sundayStart}
                    setTime={setSundayStart}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                  <TextView theme={theme} size={22}>
                    to
                  </TextView>
                  <TimePicker
                    time={sundayEnd}
                    setTime={setSundayEnd}
                    theme={theme}
                    textSize={24}
                    textStyles={[layout.padding_horizontal]}
                  />
                </SideBySide>
              </View>
            </View>
          </Grid>
        </View>
        {/* CSV */}
        {/* <View style={[layout.padding_vertical]}>
          <CSVtoJSONConverterView func={onUploadCSV} />
        </View> */}
        <Spacer height={60} />
      </ScrollView>
    </SafeArea>
  );
}
