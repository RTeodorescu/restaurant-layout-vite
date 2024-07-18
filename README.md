# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

Other links:
* How to export data: https://medium.com/@gb.usmanumar/how-to-export-data-to-csv-json-in-react-js-ea45d940652a
* Load from file - https://stackoverflow.com/questions/61707105/react-app-upload-and-read-json-file-into-variable-without-a-server
* https://www.sitepoint.com/fabric-js-advanced/
* https://hackernoon.com/a-comprehensive-guide-to-working-with-objects-and-shapes-in-fabricjs
* How to debug React - VSCode - https://profy.dev/article/debug-react-vscode
* Fabric JS tutorial - http://fabricjs.com/fabric-intro-part-1
* https://aprilescobar.medium.com/part-1-fabric-js-on-react-fabric-canvas-e4094e4d0304
* https://aprilescobar.medium.com/part-2-fabric-js-on-react-fabric-rect-533c5d8bbe55
* https://aprilescobar.medium.com/part-3-fabric-js-on-react-fabric-image-fromurl-4185e0d945d3
* Create a react app - https://legacy.reactjs.org/docs/create-a-new-react-app.html
* Fabric JS tutorial - https://www.youtube.com/watch?v=mghXNWvVGTs&t=274s
* https://flaviocopes.com/vite-react-app/
* https://thevalleyofcode.com/react/1-demo-setting-up-a-react-project-with-vite
To run this just run 'npm run dev' in a terminal (all develpment work was done on mac using chrome; latest node version; latest react version; fabric.js v6.0.x)
Collaboration Doc Link: https://docs.google.com/document/d/12OZPseCMDbUplVtwIry8x9yOj_xjKs8bS5PHEsk31ck/edit

Please install the following packages in addtion to the previous ones:
npm install react-hook-form
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms
npm install -D @tailwindcss/typography
npm install yup
npm install -D @hookform/resolvers

material UI:
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
https://mui.com/material-ui/react-text-field/

https://github.com/PranavB6/tutorials/blob/main/react-hook-form-basic-tutorial/react-hook-form-tutorial-end/README.md
https://medium.com/@msgold/creating-a-react-form-using-react-hook-form-and-yup-in-typescript-640168c5ed57


https://tailwindcss.com/docs/guides/vite
npx tailwindcss init -p