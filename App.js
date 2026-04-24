import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { products } from "./data/products";
import ProductCard from "./components/ProductCard";

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState("none");
  const [useSection, setUseSection] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const categories = ["Semua", "Turbo", "Engine", "Brake", "Wheel", "Interior", "Gadget"];

  // 🔍 FILTER + SEARCH
  const filtered = useMemo(() => {
    let data = products.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Semua" || item.category === category;
      return matchSearch && matchCategory;
    });

    // 🔃 SORT
    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      data.sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [search, category, sort]);

  // 📚 SECTION DATA
  const sectionData = categories
    .filter((c) => c !== "Semua")
    .map((cat) => ({
      title: cat,
      data: filtered.filter((item) => item.category === cat),
    }))
    .filter((section) => section.data.length > 0);

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>

      {/* HEADER */}
      <Text style={[styles.title, isDark && styles.darkText]}>
        🏁 Agape Racing Store
      </Text>

      {/* SEARCH */}
      <TextInput
        style={[styles.search, isDark && styles.darkSearch]}
        placeholder="Search parts..."
        placeholderTextColor={isDark ? "#aaa" : "#999"}
        value={search}
        onChangeText={setSearch}
      />

      {/* CATEGORY CHIPS */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item)}
            style={[
              styles.chip,
              category === item && styles.chipActive,
            ]}
          >
            <Text style={[
              styles.chipText,
              category === item && styles.chipTextActive
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* SORT + TOGGLE */}
      <View style={styles.actionRow}>

        <TouchableOpacity onPress={() => setSort("low")}>
          <Text style={styles.actionBtn}>Low Price</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSort("high")}>
          <Text style={styles.actionBtn}>High Price</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSort("rating")}>
          <Text style={styles.actionBtn}>Rating</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setGrid(!grid)}>
          <Text style={styles.actionBtn}>
            {grid ? "List" : "Grid"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setUseSection(!useSection)}>
          <Text style={styles.actionBtn}>
            Section
          </Text>
        </TouchableOpacity>

      </View>

      {/* LIST MODE */}
      {!useSection ? (
        <FlatList
          data={filtered}
          key={grid ? "g" : "l"}
          keyExtractor={(item) => item.id}
          numColumns={grid ? 2 : 1}
          renderItem={({ item }) => (
            <ProductCard item={item} isDark={isDark} />
          )}
        />
      ) : (
        /* SECTION LIST MODE */
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard item={item} isDark={isDark} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 12,
  },

  darkContainer: {
    backgroundColor: "#0F1115",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  darkText: {
    color: "#fff",
  },

  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  darkSearch: {
    backgroundColor: "#1A1D24",
    color: "#fff",
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },

  chipActive: {
    backgroundColor: "#FF3B30",
  },

  chipText: {
    color: "#333",
  },

  chipTextActive: {
    color: "#fff",
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 10,
  },

  actionBtn: {
    fontSize: 12,
    color: "#2F80ED",
    marginRight: 10,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
    color: "#444",
  },
});