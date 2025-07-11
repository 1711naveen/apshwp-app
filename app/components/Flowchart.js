import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FlowchartStep from "../components/FlowchartStep";
import { ArrowRight, ArrowDown, ArrowLeft } from "../components/Arrow";

export default function Flowchart() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calling All Adolescents and Youth!</Text>

      {/* Top Row */}
      <View style={styles.row}>
        <FlowchartStep
          icon={require("../../assets/images/app-images/get-registered.png")}
          label="Get Registered"
        />
        <ArrowRight />
        <FlowchartStep
          icon={require("../../assets/images/app-images/complete-emodule.png")}
          label="Complete E-Modules"
        />
        <ArrowRight />
        <FlowchartStep
          icon={require("../../assets/images/app-images/take-quiz.png")}
          label="Take Quizzes"
        />
      </View>

      {/* Vertical arrow under E-Modules */}
      <View style={styles.verticalArrowRow}>
        <View style={{ width: 80 }} />
        <ArrowDown />
      </View>

      {/* Bottom Row */}
      <View style={styles.row}>
        <FlowchartStep
          icon={require("../../assets/images/app-images/hof.png")}
          label="Feature in Hall of Fame"
        />
        <ArrowLeft />
        <FlowchartStep
          icon={require("../../assets/images/app-images/invitefriend.png")}
          label="Invite your friends"
        />
        <ArrowLeft />
        <FlowchartStep
          icon={require("../../assets/images/app-images/earn-certificate.png")}
          label="Earn Certificates"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0D0D26",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    flexWrap: "nowrap",
  },
  verticalArrowRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
});
