import { useEffect, useState } from "react";
import {
  ButtonOne,
  CheckboxOne,
  DropdownOne,
  Grid,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  Spacer,
  TextAreaOne,
  TextFieldOne,
  TextView,
  firebase_CreateDocument,
  firebase_GetAllDocuments,
  format,
  function_PickImage,
  getInDevice,
  height,
  layout,
  randomString,
  removeDuplicates,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  storage_UploadImage,
  themedBackgroundColor,
  themedTextColor,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";
import Checkbox from "expo-checkbox";

export function NewItem({ navigation, route }) {
  const { items, setItems } = route.params;
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [me, setMe] = useState({});
  //
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [soldOut, setSoldOut] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState([]);
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const [showEditOptionForm, setShowEditOptionForm] = useState(false);

  //
  const [optionName, setOptionName] = useState("");
  const [optionCategory, setOptionCategory] = useState("");
  const [optionCategoryText, setOptionCategoryText] = useState("");
  const [optionAmount, setOptionAmount] = useState("");
  const [optionShowOption, setOptionShowOption] = useState(false);
  const [optionShowMultiple, setOptionShowMultiple] = useState(false);
  const [optionRequire, setOptionRequire] = useState(false);

  const [chosenEditOption, setChosenEditOption] = useState({});
  const [optionEditName, setOptionEditName] = useState("");
  const [optionEditCategory, setOptionEditCategory] = useState("");
  const [optionEditCategoryText, setOptionEditCategoryText] = useState("");
  const [optionEditAmount, setOptionEditAmount] = useState("");
  const [optionEditShowOption, setOptionEditShowOption] = useState(false);
  const [optionEditShowMultiple, setOptionEditShowMultiple] = useState(false);
  const [optionEditRequire, setOptionEditRequire] = useState(false);
  //
  function onCreateItem() {
    Alert.alert(
      "New Item",
      "Are you sure all the information is filled out and accurate?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "default",
          onPress: () => {
            setLoading(true);
            const imagePath = `Images/${randomString(25)}.jpg`;
            const itemID = randomString(25);
            const args = {
              Name: name,
              Description: desc.replaceAll("\n", "jjj"),
              Category: categoryText !== "" ? categoryText : category,
              Price: parseFloat(price),
              Featured: featured,
              SoldOut: soldOut,
              ImagePath: image !== null && imagePath,
              Options: options,
            };

            if (image !== null) {
              storage_UploadImage(
                setFakeLoading,
                image,
                imagePath,
                setProgress
              ).then(() => {
                firebase_CreateDocument(args, `Items-${me.id}`, itemID).then(
                  () => {
                    // setItems((prev) => [...prev, { id: itemID, ...args }]);
                    navigation.navigate("menu");
                  }
                );
              });
            }
          },
        },
      ]
    );
  }
  function onCreateOption() {
    const args = {
      id: randomString(25),
      Name: optionName,
      Amount: parseFloat(optionAmount),
      SubCategory:
        optionCategory === "Add New Sub Category" || optionCategoryText !== ""
          ? optionCategoryText
          : optionCategory,
      ShowOptionAmount: optionShowOption,
      AllowMultiple: optionShowMultiple,
      Required: optionRequire,
    };
    setOptions((prev) => [...prev, args]);
    setOptionName("");
    setOptionAmount("");
    setOptionCategory("");
    setOptionCategoryText("");
    setOptionShowMultiple(false);
    setOptionShowOption(false);
    setOptionRequire(false);
    setShowNewOptionForm(false);
  }
  function onRemoveOption(opt) {
    setOptions((prev) => [...prev.filter((ting) => ting.id !== opt.id)]);
  }
  function onEditOption(opt) {
    setChosenEditOption(opt);
    setOptionEditName(opt.Name);
    setOptionEditCategory(opt.SubCategory);
    setOptionEditAmount(`${opt.Amount}`);
    setOptionEditShowOption(opt.ShowOptionAmount);
    setOptionEditShowMultiple(opt.AllowMultiple);
    setOptionEditRequire(opt.Required);
    setShowEditOptionForm(true);
  }
  function onSaveOptionChanges() {
    const newObj = {
      id: chosenEditOption.id,
      Name: optionEditName,
      SubCategory:
        optionEditCategoryText !== "" &&
        optionEditCategory === "Add New Sub Category"
          ? optionEditCategoryText
          : optionEditCategory,
      Amount: parseFloat(optionEditAmount),
      ShowOptionAmount: optionEditShowOption,
      AllowMultiple: optionEditShowMultiple,
      Required: optionEditRequire,
    };
    setOptions((prev) =>
      prev.map((item) => (item.id === newObj.id ? newObj : item))
    );
    setChosenEditOption({});
    setOptionEditName("");
    setOptionEditCategory("");
    setOptionEditCategoryText("");
    setOptionEditAmount("");
    setOptionEditShowOption(false);
    setOptionEditShowMultiple(false);
    setOptionEditRequire(false);
    setShowEditOptionForm(false);
  }

  useEffect(() => {
    getInDevice("theme", setTheme);
    // GET CATEGORIES
    const tempArr = items.map((ting) => {
      return ting.Category;
    });
    setCategories(removeDuplicates(tempArr));
    getInDevice("user", (person) => {
      setMe(person);
    });
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
            <TopFive
              title={"New Item Form"}
              caption={"Fill out all fields."}
              theme={theme}
            />
            <SideBySide>
              {name !== "" &&
                price !== "" &&
                parseFloat(price) > 0 &&
                (category !== "" || categoryText !== "") && (
                  <ButtonOne
                    backgroundColor={"#1BA8FF"}
                    radius={100}
                    padding={12}
                    onPress={onCreateItem}
                  >
                    <View style={[layout.padding_horizontal]}>
                      <TextView theme={theme} color={"white"} size={22}>
                        Create Item
                      </TextView>
                    </View>
                  </ButtonOne>
                )}
              <IconButtonTwo
                name={"close-outline"}
                size={32}
                padding={14}
                theme={theme}
                onPress={() => {
                  Alert.alert(
                    "Exit Form",
                    "Are you sure you want to close this form? Any information entered will be lost.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Exit Form",
                        style: "destructive",
                        onPress: () => {
                          navigation.navigate("menu");
                        },
                      },
                    ]
                  );
                }}
              />
            </SideBySide>
          </SeparatedView>
        </View>
        {/* GRID */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Grid columns={2} gap={10}>
            {/* LEFT */}
            <View>
              {/* NAME */}
              <View>
                <TextView
                  theme={theme}
                  styles={[
                    layout.padding_vertical_small,
                    layout.padding_horizontal,
                  ]}
                  size={22}
                >
                  Name
                </TextView>
                <TextFieldOne
                  placeholder={"White Chocolate Latte"}
                  value={name}
                  setter={setName}
                  theme={theme}
                  radius={0}
                  textSize={24}
                  paddingV={14}
                />
                <Spacer height={10} />
              </View>
              <View>
                <TextView
                  size={22}
                  theme={theme}
                  styles={[
                    layout.padding_vertical_small,
                    layout.padding_horizontal,
                  ]}
                >
                  Description
                </TextView>
                <TextAreaOne
                  placeholder={
                    "Enter a description about this particular item."
                  }
                  value={desc}
                  setter={setDesc}
                  theme={theme}
                  radius={0}
                  textSize={24}
                  paddingV={14}
                />
                <Spacer height={10} />
              </View>
              <Grid columns={2} gap={10}>
                <View>
                  <TextView
                    size={22}
                    theme={theme}
                    styles={[
                      layout.padding_vertical_small,
                      layout.padding_horizontal,
                    ]}
                  >
                    Category
                  </TextView>
                  {categories.length > 0 && (
                    <DropdownOne
                      setter={setCategory}
                      value={category}
                      options={["Add New Category", ...categories]}
                      theme={theme}
                      radius={0}
                      textSize={24}
                      padding={14}
                    />
                  )}
                  {(categories.length === 0 ||
                    category === "Add New Category") && (
                    <TextFieldOne
                      placeholder={"Hot Drinks, Blends, Pastries..."}
                      value={categoryText}
                      setter={setCategoryText}
                      theme={theme}
                      radius={0}
                      textSize={24}
                      paddingV={14}
                    />
                  )}
                  <Spacer height={10} />
                </View>
                <View>
                  <TextView
                    size={22}
                    theme={theme}
                    styles={[
                      layout.padding_vertical_small,
                      layout.padding_horizontal,
                    ]}
                  >
                    Base Price $
                  </TextView>
                  <TextFieldOne
                    placeholder={"$"}
                    value={price}
                    setter={setPrice}
                    theme={theme}
                    radius={0}
                    isNum={true}
                    textSize={24}
                    paddingV={14}
                  />
                  <Spacer height={10} />
                </View>
              </Grid>
              <View style={[layout.padding]}>
                <CheckboxOne
                  text={"Is this item sold out, or not available."}
                  setter={setSoldOut}
                  value={soldOut}
                  theme={theme}
                  checkSize={14}
                  textSize={24}
                />
                <Spacer height={10} />
                <CheckboxOne
                  text={"Do you want to feature this item?"}
                  setter={setFeatured}
                  value={featured}
                  checkSize={14}
                  textSize={24}
                  theme={theme}
                />
              </View>
              {/* OPTIONS */}
              <View
                style={[
                  {
                    borderTopColor: secondaryThemedTextColor(theme),
                    borderTopWidth: 1,
                    marginVertical: 10,
                  },
                ]}
              ></View>
              <Spacer height={10} />
              <View style={[layout.padding_horizontal]}>
                <TextView theme={theme} size={24}>
                  Custom Options
                </TextView>
                <TextView theme={theme} size={20}>
                  Customize menu items that you want to add to this
                </TextView>
                <Spacer height={10} />
                {/* BUTTON */}
                {!showNewOptionForm && (
                  <View style={[layout.fit_width, layout.padding_vertical]}>
                    <ButtonOne
                      backgroundColor={secondaryThemedBackgroundColor(theme)}
                      radius={100}
                      padding={10}
                      onPress={() => {
                        setShowNewOptionForm(true);
                      }}
                    >
                      <View style={[layout.padding_horizontal]}>
                        <TextView theme={theme} center={true} size={22}>
                          New Option
                        </TextView>
                      </View>
                    </ButtonOne>
                  </View>
                )}
                {/* NEW FORM */}
                {showNewOptionForm && (
                  <View
                    style={[
                      {
                        backgroundColor: secondaryThemedBackgroundColor(theme),
                      },
                      layout.padding,
                      format.radius,
                      layout.margin_vertical,
                    ]}
                  >
                    {/* CATEGORIES */}
                    <View>
                      {/* DROPDOWN */}
                      {options.length > 0 && (
                        <View>
                          <TextView
                            theme={theme}
                            size={22}
                            styles={[layout.padding_vertical_small]}
                          >
                            Sub Category
                          </TextView>
                          <DropdownOne
                            options={[
                              "Add New Sub Category",
                              ...Array.from(
                                new Set(options.map((ting) => ting.SubCategory))
                              ),
                            ]}
                            value={optionCategory}
                            setter={setOptionCategory}
                            radius={0}
                            theme={theme}
                            textSize={24}
                            padding={14}
                          />
                        </View>
                      )}
                      {/* TEXTBOX */}
                      {(options.length === 0 ||
                        optionCategory === "Add New Sub Category") && (
                        <View>
                          <TextView
                            theme={theme}
                            size={22}
                            styles={[layout.padding_vertical_small]}
                          >
                            Sub Category
                          </TextView>
                          <TextFieldOne
                            placeholder={"Extras, Sugar Amount, ..."}
                            value={optionCategoryText}
                            setter={setOptionCategoryText}
                            radius={0}
                            textSize={24}
                            paddingV={14}
                          />
                        </View>
                      )}
                    </View>
                    <Grid columns={2} gap={6}>
                      <View>
                        <TextView
                          theme={theme}
                          size={22}
                          styles={[layout.padding_vertical_small]}
                        >
                          Option Name
                        </TextView>
                        <TextFieldOne
                          placeholder={"Extra Cream, Extra Shot, etc.."}
                          value={optionName}
                          setter={setOptionName}
                          radius={0}
                          textSize={24}
                          paddingV={14}
                        />
                      </View>
                      <View>
                        <TextView
                          theme={theme}
                          size={22}
                          styles={[layout.padding_vertical_small]}
                        >
                          Adjusted Amount
                        </TextView>
                        <TextFieldOne
                          placeholder={"$"}
                          value={optionAmount}
                          setter={setOptionAmount}
                          radius={0}
                          isNum={true}
                          textSize={24}
                          paddingV={14}
                        />
                      </View>
                    </Grid>
                    <View style={[layout.padding_vertical_small, { gap: 8 }]}>
                      <CheckboxOne
                        value={optionShowOption}
                        setter={setOptionShowOption}
                        text={"Do you want to show the amount to the customer?"}
                        checkSize={14}
                        textSize={24}
                      />
                      <CheckboxOne
                        value={optionShowMultiple}
                        setter={setOptionShowMultiple}
                        text={
                          "Should the customer be able to choose higher quantity?"
                        }
                        checkSize={14}
                        textSize={24}
                      />
                      <CheckboxOne
                        value={optionRequire}
                        setter={setOptionRequire}
                        text={"Is this custom option required?"}
                        checkSize={14}
                        textSize={24}
                      />
                    </View>
                    <Spacer height={10} />
                    <SideBySide>
                      <View>
                        <View style={[layout.center, layout.fit_width]}>
                          <ButtonOne
                            backgroundColor={themedBackgroundColor(theme)}
                            radius={100}
                            padding={10}
                            onPress={() => {
                              setOptionName("");
                              setOptionAmount("");
                              setOptionCategory("");
                              setOptionCategoryText("");
                              setOptionShowMultiple(false);
                              setOptionShowOption(false);
                              setOptionRequire(false);
                              setShowNewOptionForm(false);
                            }}
                          >
                            <View style={[layout.padding_horizontal]}>
                              <TextView
                                theme={theme}
                                color={themedTextColor(theme)}
                                center={true}
                                size={22}
                              >
                                Close
                              </TextView>
                            </View>
                          </ButtonOne>
                        </View>
                      </View>
                      <View>
                        {optionName !== "" &&
                          optionAmount !== "" &&
                          ((optionCategoryText !== "" &&
                            (optionCategory === "" ||
                              optionCategory === "Add New Sub Category")) ||
                            (optionCategory !== "" &&
                              optionCategory !== "Add New Sub Category")) && (
                            <View
                              style={[
                                layout.padding_vertical,
                                layout.center,
                                layout.fit_width,
                              ]}
                            >
                              <ButtonOne
                                backgroundColor={"#1BA8FF"}
                                radius={100}
                                padding={10}
                                onPress={() => {
                                  onCreateOption();
                                }}
                              >
                                <View style={[layout.padding_horizontal]}>
                                  <TextView
                                    theme={theme}
                                    color={"white"}
                                    center={true}
                                    size={16}
                                  >
                                    Create Option
                                  </TextView>
                                </View>
                              </ButtonOne>
                            </View>
                          )}
                      </View>
                    </SideBySide>
                  </View>
                )}
                {/* EDIT FORM */}
                {showEditOptionForm && (
                  <View
                    style={[
                      {
                        backgroundColor: secondaryThemedBackgroundColor(theme),
                      },
                      layout.padding,
                      format.radius,
                      layout.margin_vertical,
                    ]}
                  >
                    <View>
                      {/* DROPDOWN */}
                      {options.length > 0 && (
                        <View>
                          <TextView
                            theme={theme}
                            size={22}
                            styles={[layout.padding_vertical_small]}
                          >
                            Sub Category
                          </TextView>
                          <DropdownOne
                            options={[
                              "Add New Sub Category",
                              ...Array.from(
                                new Set(options.map((ting) => ting.SubCategory))
                              ),
                            ]}
                            value={optionEditCategory}
                            setter={setOptionEditCategory}
                            radius={0}
                            theme={theme}
                            textSize={24}
                            padding={14}
                          />
                        </View>
                      )}
                      {/* TEXTBOX */}
                      {(options.length === 0 ||
                        optionEditCategory === "Add New Sub Category") && (
                        <View>
                          <TextView
                            theme={theme}
                            size={22}
                            styles={[layout.padding_vertical_small]}
                          >
                            Type New Sub Category
                          </TextView>
                          <TextFieldOne
                            placeholder={"Extras, Sugar Amount, ..."}
                            value={optionEditCategoryText}
                            setter={setOptionEditCategoryText}
                            radius={0}
                            textSize={24}
                            paddingV={14}
                          />
                        </View>
                      )}
                    </View>
                    <Grid columns={2} gap={6}>
                      {/* CATEGORIES */}

                      <View>
                        <TextView
                          theme={theme}
                          size={22}
                          styles={[layout.padding_vertical_small]}
                        >
                          Option Name
                        </TextView>
                        <TextFieldOne
                          placeholder={"Extra Cream, Extra Shot, etc.."}
                          value={optionEditName}
                          setter={setOptionEditName}
                          radius={0}
                          textSize={24}
                          paddingV={14}
                        />
                      </View>
                      <View>
                        <TextView
                          theme={theme}
                          size={22}
                          styles={[layout.padding_vertical_small]}
                        >
                          Adjusted Amount
                        </TextView>
                        <TextFieldOne
                          placeholder={"$"}
                          value={optionEditAmount}
                          setter={setOptionEditAmount}
                          radius={0}
                          isNum={true}
                          textSize={24}
                          paddingV={14}
                        />
                      </View>
                    </Grid>
                    <View style={[layout.padding_vertical_small, { gap: 8 }]}>
                      <CheckboxOne
                        value={optionEditShowOption}
                        setter={setOptionEditShowOption}
                        text={"Do you want to show the amount to the customer?"}
                        checkSize={14}
                        textSize={24}
                      />
                      <CheckboxOne
                        value={optionEditShowMultiple}
                        setter={setOptionEditShowMultiple}
                        text={
                          "Should the customer be able to choose higher quantity?"
                        }
                        checkSize={14}
                        textSize={24}
                      />
                      <CheckboxOne
                        value={optionEditRequire}
                        setter={setOptionEditRequire}
                        text={"Is this custom option required?"}
                        checkSize={14}
                        textSize={24}
                      />
                    </View>
                    <Spacer height={10} />
                    <SideBySide>
                      <View>
                        <View style={[layout.center, layout.fit_width]}>
                          <ButtonOne
                            backgroundColor={themedBackgroundColor(theme)}
                            radius={100}
                            padding={10}
                            onPress={() => {
                              setOptionEditName("");
                              setOptionEditAmount("");
                              setOptionEditCategory("");
                              setOptionEditCategoryText("");
                              setOptionEditShowMultiple(false);
                              setOptionEditShowOption(false);
                              setOptionEditRequire(false);
                              setShowEditOptionForm(false);
                            }}
                          >
                            <View style={[layout.padding_horizontal]}>
                              <TextView
                                theme={theme}
                                color={themedTextColor(theme)}
                                center={true}
                                size={22}
                              >
                                Close
                              </TextView>
                            </View>
                          </ButtonOne>
                        </View>
                      </View>
                      <View>
                        {optionEditName !== "" &&
                          optionEditAmount !== "" &&
                          ((optionEditCategoryText !== "" &&
                            optionEditCategory === "Add New Sub Category") ||
                            (optionEditCategory !== "Add New Sub Category" &&
                              optionEditCategory !== "")) && (
                            <View
                              style={[
                                layout.padding_vertical,
                                layout.center,
                                layout.fit_width,
                              ]}
                            >
                              <ButtonOne
                                backgroundColor={"#1BA8FF"}
                                radius={100}
                                padding={10}
                                onPress={() => {
                                  onSaveOptionChanges();
                                }}
                              >
                                <View style={[layout.padding_horizontal]}>
                                  <TextView
                                    theme={theme}
                                    color={"white"}
                                    center={true}
                                    size={22}
                                  >
                                    Save Changes
                                  </TextView>
                                </View>
                              </ButtonOne>
                            </View>
                          )}
                      </View>
                    </SideBySide>
                  </View>
                )}

                {/* OPTIONS */}
                {options.map((opt, i) => {
                  return (
                    <TouchableOpacity key={i}>
                      <SeparatedView>
                        <View>
                          <TextView theme={theme} size={22} color={"#1BA8FF"}>
                            {opt.SubCategory}
                          </TextView>
                          <SideBySide gap={20}>
                            <TextView theme={theme} size={24}>
                              {opt.Name}
                            </TextView>
                            <TextView theme={theme} size={24}>
                              + ${opt.Amount.toFixed(2)}
                            </TextView>
                          </SideBySide>
                        </View>
                        <View>
                          <SideBySide>
                            <IconButtonTwo
                              theme={theme}
                              padding={6}
                              size={32}
                              name={"close-outline"}
                              lightBackground={"#D6133B"}
                              darkBackground={"#D6133B"}
                              onPress={() => {
                                onRemoveOption(opt);
                              }}
                            />
                            <IconButtonTwo
                              theme={theme}
                              padding={6}
                              size={32}
                              name={"pencil-outline"}
                              lightBackground={"#2F70D5"}
                              darkBackground={"#2F70D5"}
                              onPress={() => {
                                onEditOption(opt);
                              }}
                            />
                          </SideBySide>
                        </View>
                      </SeparatedView>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* RIGHT */}
            <View>
              <Spacer height={20} />
              {image !== null && (
                <Image source={{ uri: image }} height={height * 0.7} />
              )}
              <Grid columns={2} gap={15}>
                <ButtonOne backgroundColor={"black"} radius={0} padding={16}>
                  <TextView
                    theme={theme}
                    color={"white"}
                    center={true}
                    size={24}
                  >
                    Take Photo
                  </TextView>
                </ButtonOne>
                <ButtonOne
                  backgroundColor={secondaryThemedBackgroundColor(theme)}
                  radius={0}
                  padding={16}
                  onPress={() => {
                    function_PickImage(setLoading, setImage, (img) => {});
                  }}
                >
                  <TextView theme={theme} center={true} size={24}>
                    Choose Photo
                  </TextView>
                </ButtonOne>
              </Grid>
            </View>
          </Grid>
          <Spacer height={50} />
        </ScrollView>
      </SafeArea>
    </KeyboardAvoidingView>
  );
}
