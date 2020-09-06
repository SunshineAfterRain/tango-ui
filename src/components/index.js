const files = require.context("./", true, /\.js$/);
const components = [];
files.keys().forEach(path => {
  if (path.startsWith("./index.js")) return;
  const module = files(path);
  const comp = module.default || module;
  components.push(comp);
});

const install = Vue => {
  components.forEach(item => {
    console.log(item);
    Vue.use(item);
  });
};

export default {
  install,
  ...components
};
