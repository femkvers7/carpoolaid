# routing
done automatically through page names

# layouts
are possible!
default.vue will be used by default
!!!!! if only one layout, it's recommended to use app.vue in the root with a <NuxtPage /> where the content should come
alternative layouts can be loaded in through a page's metadata
aah yes and in the layout, you use <slot/> where content should come

[More info here](https://nuxt.com/docs/guide/directory-structure/layouts)

# html template / <head>
notice that the <head> section is nowhere to be found. you can edit it [here](https://nuxt.com/docs/getting-started/seo-meta)
If you need more control, install nitro plugin

# assets (stylesheets, fonts, images)

public/ 
-> is served to the server root as-is
-> static assets
assets/ 
-> contains every asset that you want the build tool to process
-> does not process these by default, have to write plugins to do that

--> so it doesnt really matter

# styling
will probably install sass or scss
-> you can pass variables to your page styling through assets & nuxt.config

[here](https://nuxt.com/docs/getting-started/assets#global-styles-imports)

to import stylesheets, use css @import url("/../..") in you <style></style>
or globally import it in nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css']
})

with scss (see link above)
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_colors.scss" as *;'
        }
      }
    }
  }
})

# fonts 
are advised to be placed in public
[text](https://nuxt.com/docs/getting-started/styling#working-with-fonts)

# routing
use <NuxtLink> for quick routing without page rerenders

access route parameters via
const route = useRoute()
route.params.paramName

!! middleware (e.g. for checking authority) [text](https://nuxt.com/docs/getting-started/routing#route-middleware)

[Route validation](https://nuxt.com/docs/getting-started/routing#route-validation) (to check if parameters are ok)

# fetching data
[see this](https://nuxt.com/docs/getting-started/data-fetching)

# state management
[!!!](https://nuxt.com/docs/getting-started/state-management)

!!!!! vuex is no longer used for state mngmt
pinia is the new default
[Pinia](https://nuxt.com/modules/pinia)