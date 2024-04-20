import { useEffect, useState } from "react";
import {
  DatePicker,
  Grid,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextView,
  checkDate,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsOrdered,
  firebase_GetDocument,
  format,
  getInDevice,
  layout,
  reduceArray,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { ScrollView, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function SalesReport({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});

  const [date, setDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person);
      firebase_GetAllDocumentsOrdered(
        setLoading,
        `Orders-${person.id}`,
        (theseOrders) => {
          setOrders(theseOrders);
        },
        0,
        "desc",
        "Date",
        "Status",
        "==",
        "Completed",
        false,
        null,
        null
      );
      firebase_GetDocument(
        setLoading,
        `Settings-${person.id}`,
        "settings",
        (settings) => {
          setTax(settings.Tax);
        }
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
            title={"Sales Report"}
            caption={"View daily sales data."}
            theme={theme}
          />
        </SideBySide>
      </View>
      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layout.padding_horizontal]}>
          <TextView theme={theme} size={22}>
            Pick A Date:
          </TextView>
          <Spacer height={10} />
          <View style={[{ width: width * 0.4 }]}>
            <DatePicker
              theme={theme}
              date={date}
              setDate={setDate}
              textSize={24}
            />
          </View>
          <Spacer height={15} />
          <View style={[layout.horizontal]}>
            <Grid columns={4} gap={10}>
              {orders
                .filter((ting) =>
                  checkDate(new Date(date), new Date(ting.Date.seconds * 1000))
                )
                .map((order, i) => {
                  return (
                    <View
                      key={i}
                      style={[
                        {
                          backgroundColor:
                            secondaryThemedBackgroundColor(theme),
                        },
                        layout.padding,
                      ]}
                    >
                      <TextView
                        theme={theme}
                        size={26}
                        bold={true}
                        styles={[format.all_caps]}
                      >
                        Order #{order.id.slice(-8)}
                      </TextView>
                      <Spacer height={20} />
                      <View style={[layout.vertical]}>
                        {order.Items.map((item, it) => {
                          return (
                            <View key={it}>
                              <SideBySide>
                                <TextView size={26} theme={theme}>
                                  {item.Quantity}x
                                </TextView>

                                <TextView
                                  size={24}
                                  theme={theme}
                                  styles={[{ width: "85%" }]}
                                >
                                  {item.Item.Name}
                                </TextView>
                              </SideBySide>
                              <SeparatedView>
                                <View></View>
                                <SideBySide>
                                  {item.Discounted > 0 && (
                                    <TextView
                                      theme={theme}
                                      size={20}
                                      styles={[format.strike]}
                                    >
                                      ${item.Item.Price.toFixed(2)}
                                    </TextView>
                                  )}
                                  <TextView theme={theme} size={24}>
                                    $
                                    {(
                                      item.Item.Price -
                                      item.Item.Price * item.Discounted * 0.01
                                    ).toFixed(2)}
                                  </TextView>
                                </SideBySide>
                              </SeparatedView>
                              <View style={[layout.padding_horizontal]}>
                                {item.ChosenOptions.map((opt, o) => {
                                  return (
                                    <View key={o}>
                                      <SeparatedView>
                                        <View style={[{ flex: 1 }]}>
                                          <SideBySide>
                                            <TextView theme={theme} size={20}>
                                              {opt.Name}
                                            </TextView>
                                            <TextView theme={theme} size={20}>
                                              {opt.OptionQuantity}x
                                            </TextView>
                                          </SideBySide>
                                        </View>
                                        <TextView size={20} theme={theme}>
                                          ${opt.Amount.toFixed(2)}
                                        </TextView>
                                      </SeparatedView>
                                    </View>
                                  );
                                })}
                              </View>
                              <View
                                style={[
                                  {
                                    borderTopColor:
                                      secondaryThemedTextColor(theme),
                                    borderTopWidth: 1,
                                    marginVertical: 8,
                                  },
                                ]}
                              ></View>
                              <SeparatedView>
                                <View></View>
                                <TextView
                                  theme={theme}
                                  size={24}
                                  bold={true}
                                  color={"#117DFA"}
                                >
                                  ${item.Total.toFixed(2)}
                                </TextView>
                              </SeparatedView>
                            </View>
                          );
                        })}
                      </View>
                      <Spacer height={20} />
                      <View>
                        <SeparatedView>
                          <TextView theme={theme} size={20}>
                            Subtotal:{" "}
                          </TextView>
                          <TextView theme={theme} size={20}>
                            ${reduceArray(order.Items, "Total").toFixed(2)}
                          </TextView>
                        </SeparatedView>
                        <SeparatedView>
                          <TextView theme={theme} size={20}>
                            Tax:{" "}
                          </TextView>
                          <TextView theme={theme} size={20}>
                            $
                            {(
                              reduceArray(order.Items, "Total") *
                              tax *
                              0.01
                            ).toFixed(2)}
                          </TextView>
                        </SeparatedView>
                        <SeparatedView>
                          <TextView
                            theme={theme}
                            size={26}
                            bold={true}
                            color={"#117DFA"}
                          >
                            Total:{" "}
                          </TextView>
                          <TextView
                            theme={theme}
                            size={26}
                            bold={true}
                            color={"#117DFA"}
                          >
                            $
                            {(
                              reduceArray(order.Items, "Total") +
                              reduceArray(order.Items, "Total") * tax * 0.01
                            ).toFixed(2)}
                          </TextView>
                        </SeparatedView>
                      </View>
                    </View>
                  );
                })}
            </Grid>
          </View>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
