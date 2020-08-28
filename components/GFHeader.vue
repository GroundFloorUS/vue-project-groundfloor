<template>
  <b-navbar class="gf-navbar" type="dark" variant="dark"
            toggleable="md">

    <b-navbar-toggle target="nav_collapse"/>

    <nuxt-link class="navbar-brand" to="/">
      <img class="gf-header-brand" src="~/assets/GROUNDFLOOR-light-text.png">
    </nuxt-link>

    <b-collapse id="nav_collapse" is-nav>

      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown text="INVEST" right class="invest-dropdown">
          <nuxt-link class="dropdown-item" role="menuitem" to="/funding">
            FUNDING
          </nuxt-link>

          <nuxt-link class="dropdown-item" role="menuitem" to="/funded">
            FUNDED
          </nuxt-link>

        </b-nav-item-dropdown>

        <b-nav-item>
          <nuxt-link class="nav-link" role="menuitem" to="/borrow">BORROW</nuxt-link>
        </b-nav-item>

      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<style>
img.gf-header-brand {
  height: 2em;
}
.invest-dropdown {
  padding-top: 8px;
}
.error-text {
  color: #ff0000;
}
</style>
