import eslintJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  // general defaults
  eslintJs.configs["recommended"],
  ...pluginVue.configs["flat/recommended"],
  skipFormatting,
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,jsx,ts,mts,tsx,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/block-lang": "off",
      "vue/attribute-hyphenation": "off",
      "no-unused-expressions": "off"
    }
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
  }
];
