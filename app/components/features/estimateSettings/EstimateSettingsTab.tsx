import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../common/Button";
import { Colors } from "@/app/constants/colors";
import { FileUploader } from "../../common/FileUploader";
import { router } from "expo-router";
import { UploadSuccess } from "../../common/uploadsuccess";
import { Card } from "../../common/Card";
import { CustomCollapsible } from "../../common/Collapsable";
import { CustomDropdownRow } from "../../common/CustomRowDropdown";
import { CustomInputRow } from "../../common/CustomRowInput";
        
export const EstimateDetailsTab = () => {
  const handleBack = () => router.back();

  const [estimateNo, setEstimateNo] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [estimaeRevenue, setEstimateRevenue] = useState("");
  const [nextCallback, setNextCallBack] = useState("");

  return (
    <Card>
      <View style={styles.tabContent}>
        {/* row 1 */}
        <View style={styles.row}>
          <View style={styles.contentRow}>
            <CustomInputRow
              label="Estimate No"
              placeholder="0"
              value={estimateNo}
              onChangeText={setEstimateNo}
              inputMode={"numeric"}
            />
          </View>
          <View style={styles.contentRow}>
            <CustomDropdownRow
              label="Sales Person"
              value={salesPerson}
              onValueChange={setSalesPerson}
              options={["Mr Gutter", "John Doe"]}
            />
          </View>
        </View>

        {/* row 2 */}
        <View style={styles.row}>
          <View style={styles.contentRow}>
            <CustomInputRow
              label="Created Date"
              placeholder="MM/DD/YYYY"
              value={createdDate}
              onChangeText={setCreatedDate}
              inputMode={"numeric"}
            />
          </View>
          <View style={styles.contentRow}>
            <CustomDropdownRow
              label="Estimate Revenue"
              value={estimaeRevenue}
              onValueChange={setEstimateRevenue}
              options={["$0.00", "$10.00"]}
            />
          </View>
        </View>

        {/* row 3 */}
        <View style={styles.row}>
          <View style={styles.contentRow}>
            <CustomInputRow
              label="Next callback"
              placeholder="MM/DD/YYYY"
              value={nextCallback}
              onChangeText={setNextCallBack}
              inputMode={"numeric"}
            />
          </View>
          <View style={styles.contentRow}></View>
        </View>
      </View>
      {/* Button Row */}
      <View style={styles.btnRow}>
        <Button label={"Submit"} />
        <Button label={"Cancel"} variant="outline" onPress={handleBack} />
      </View>
    </Card>
  );
};

export const CustomerDetailsTab = () => {
  const handleBack = () => router.back();

  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [mail, setMail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zipCode, setZipCode] = useState("");

  return (
    <Card>
    <View style={styles.tabContent}>
      {/* row 1 */}
      <View style={styles.row}>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="First Name"
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            inputMode={"text"}
          />
        </View>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChangeText={setlastName}
            inputMode={"text"}
          />
        </View>
      </View>

      {/* row 2 */}
      <View style={styles.row}>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Company Name"
            placeholder="XYZ"
            value={companyName}
            onChangeText={setCompanyName}
            inputMode={"text"}
          />
        </View>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Phone No"
            placeholder="+1"
            value={phoneNo}
            onChangeText={setPhoneNo}
            inputMode={"tel"}
          />
        </View>
      </View>

      {/* row 3 */}
      <View style={styles.row}>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Email"
            placeholder="xyz@test.com"
            value={mail}
            onChangeText={setMail}
            inputMode={"text"}
          />
        </View>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Address Line 1"
            placeholder="X Lane"
            value={addressLine1}
            onChangeText={setAddressLine1}
            inputMode={"text"}
          />
        </View>
      </View>

      {/* row 4 */}
      <View style={styles.row}>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Address Line 2"
            placeholder=""
            value={addressLine2}
            onChangeText={setAddressLine2}
            inputMode={"text"}
          />
        </View>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="City"
            placeholder="Cleveland"
            value={city}
            onChangeText={setCity}
            inputMode={"text"}
          />
        </View>
      </View>

      {/* row 5 */}
      <View style={styles.row}>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="State/Province"
            placeholder=""
            value={stateProv}
            onChangeText={setStateProv}
            inputMode={"text"}
          />
        </View>
        <View style={styles.contentRow}>
          <CustomInputRow
            label="Zip Code"
            placeholder="73001"
            value={zipCode}
            onChangeText={setZipCode}
            inputMode={"numeric"}
          />
        </View>
      </View>

      {/* Button Row */}
      <View style={styles.btnRow}>
        <Button label={"Submit"} />
        <Button label={"Cancel"} variant="outline" onPress={handleBack} />
      </View>
    </View>
    </Card>
  );
};

export const PropertyMeasurementsTab = () => {
  const handleBack = () => router.back();

  const [ventsStandard, setVentsStandard] = useState("");
  const [ventsTurbne, setVentsTurbine] = useState("");
  const [ventsPhoenix, setVentsPhoenix] = useState("");
  const [exhaustCap, setExhaustCap] = useState("");
  const [pipeJacks, setPipeJacks] = useState("");
  const [binDisposal, setBinDisposal] = useState("");
  const [skyLights, setSkyLights] = useState("");
  const [skylightKits, setSkylightKits] = useState("");
  const [chimneyAvg, setChimneyAvg] = useState("");
  const [chimneyLarge, setChimneyLarge] = useState("");
  const [minCharge, setMinCharge] = useState("");
  const [laborCharge, setLaborCharge] = useState("");
  const [file, setFile] = useState<{ uri: string } | string | null>(null);

  return (
    <Card>
    <View style={styles.tabContent}>
      <View style={styles.row}>
        <Text style={styles.heading}>Reports Available(0)</Text>
        {/* <Button label={"Upload File"} variant="primary" /> */}
        <View style={styles.file}>
          {file === null ? (
            <FileUploader
              accept="both"
              onUpload={(file) => {
                console.log("File uploaded for Primary Image:", file);
                setFile(file);
              }}
            />
          ) : (
            <UploadSuccess
              selectedImage={typeof file === "string" ? file : file?.uri}
            />
          )}
        </View>
      </View>

      <CustomCollapsible title={"Roof Measurement Tokens"}>
        <View style={{ padding: 20, gap: 20 }}>
          {/* row 1 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Vents-standard"
                placeholder="0"
                value={ventsStandard}
                onChangeText={setVentsStandard}
                inputMode={"text"}
                suffix="PC"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Vents-turbine"
                placeholder="0"
                value={ventsTurbne}
                onChangeText={setVentsTurbine}
                inputMode={"text"}
                suffix="PC"
              />
            </View>
          </View>

          {/* row 2 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Vents-phoenix"
                placeholder="0"
                value={ventsPhoenix}
                onChangeText={setVentsPhoenix}
                inputMode={"text"}
                suffix="PC"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Exhaust-cap"
                placeholder="0"
                value={exhaustCap}
                onChangeText={setExhaustCap}
                inputMode={"text"}
                suffix="PC"
              />
            </View>
          </View>

          {/* row 3 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Pipe jacks"
                placeholder="0"
                value={pipeJacks}
                onChangeText={setPipeJacks}
                inputMode={"text"}
                suffix="PC"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Bin disposal(Roofing)"
                placeholder="0"
                value={binDisposal}
                onChangeText={setBinDisposal}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
          </View>

          {/* row 4 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Skylights"
                placeholder="0"
                value={skyLights}
                onChangeText={setSkyLights}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Skylight Flashing kits"
                placeholder="0"
                value={skylightKits}
                onChangeText={setSkylightKits}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
          </View>

          {/* row 5 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Chimney flashing kits-average"
                placeholder="0"
                value={chimneyAvg}
                onChangeText={setChimneyAvg}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Chimney flashing kits-large"
                placeholder="0"
                value={chimneyLarge}
                onChangeText={setChimneyLarge}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
          </View>

          {/* row 6 */}
          <View style={styles.row}>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Minimum charge"
                placeholder="0"
                value={minCharge}
                onChangeText={setMinCharge}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
            <View style={styles.contentRow}>
              <CustomInputRow
                label="Labor hours"
                placeholder="0"
                value={laborCharge}
                onChangeText={setLaborCharge}
                inputMode={"text"}
                suffix="EA"
              />
            </View>
          </View>
        </View>
      </CustomCollapsible>
      <CustomCollapsible title={"Roofing Accessories"}>
        <View>
          <Text></Text>
        </View>
      </CustomCollapsible>
      <CustomCollapsible title={"Wall Measurement Tokens"}>
        <View>
          <Text></Text>
        </View>
      </CustomCollapsible>
      <CustomCollapsible title={"Roof Pitch"}>
        <View>
          <Text></Text>
        </View>
      </CustomCollapsible>
      <CustomCollapsible title={"Residential Metals"}>
        <View>
          <Text></Text>
        </View>
      </CustomCollapsible>
      <View style={styles.btnRow}>
        <Button label={"Cancel"} variant="outline" onPress={handleBack} />
      </View>
    </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    marginTop: 25,
    flex: 1,
    gap: 10,
    backgroundColor: Colors.white,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contentRow: {
    width: "48%",
  },
  btnRow: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    bottom: 10,
    right: 20,
    margin: 10,
    position: "relative",
  },
  file: { width: 250, height: 100 },
  heading: {
    fontWeight: "500",
    fontSize: 30,
  },
});