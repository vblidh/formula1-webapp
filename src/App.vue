<template>
  <v-app>
    <v-app-bar dark color="red accent-4" max-height="64">
      <v-app-bar-nav-icon> </v-app-bar-nav-icon>
      <template>
        <v-tabs>
          <v-tab to="/"> Standings </v-tab>
          <v-tab to="/drivers"> Drivers</v-tab>
          <v-tab> Teams </v-tab>
          <v-tab> Circuits </v-tab>
          <v-tab to="/races"> Races </v-tab>
          <v-tab to="/about"> Schedule </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>
