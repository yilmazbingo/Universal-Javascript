## Universal-Javascript
- In universal Javascript, we should be able to use the exact same coding style on both client-side and server-side. Node.js has no support for Es2015. However we are running webpack and babel over our entire codebase. So we can use es2015 modules in node.js.
- We have to convert our server code to a string and then send it to the browser. This code has no functionality. Browser will hydrate it. That means it will breathe life into that code. it will restore all the event handlers so our code will turn to be a normal react app.
- We have to make sure that we never ever export any server-side code into any file that will be eventually sent out to the browser. That is why we have 2 distinct bundle.js. We ship client-side bundle to the browser not server-side. since we have two webpack config files, we have to merge them to avoid repeating the code. I used [webpack-merge](https://www.npmjs.com/package/webpack-merge)
- With node unlike the browser, we can require node modules at runtime when our server first starts up. So we need to keep webpack from importing our libraries into our server bundle.js. It will reduce our bundle-size.
  in our dev.config.js (we use node.js syntax inside webpack config files)
  `const nodeWebExternals=require("webpack-node-externals")`
  `externals:[nodeWebExternals()]`
### Navigation
- Express is not going to enforce any routing rules on any incoming requests. Instead it will delegate all routing inside of our application to the react-router. For anything that is meant to show HTML we are always going to make sure that react-router is in charge of that request.
- StaticRouter is specifically made for use on the server-side-rendering. When we do the initial render of app, we use StaticRouter. After our application is shipped down to the browser and it gets hydrated, we will swap out to be using BrowserRouter.
- BrowserRouter does not work on the server because there is no address bar on the server. BrowserRouter is hardcoded to expect an address. It is designed to look at the URL in the browser's address bar.
- We have to tell StaticRouter which component should be rendered upon the request. It has location prop and we pass the `req.path`. it also has `context` prop which is an object, we will be using for the rendering pageNotFound pages.
### Redux
- We need to create two separate stores, for client and server.
- After we create our store on the server, we have to send it to the browser for the initial kickstart.
- Reducers are going to be used by the both stores.
- The whole problem in the server-side rendering, we have to wait for all async operations to finish before we send our server-side html template to the browser.
- We are going to attach a little function to all of our components that describes the data that component needs to load in order to be rendered. Then whenever a request comes to our server, we are going to look at that URL that request is trying to access and use that to figure out what sets of components need to be rendered. I use [react-router-config](https://www.npmjs.com/package/react-router-config)
- When we call those loadData function we pass in the **redux-store** to each of them. We will manually dispatch an action-creator.
    
    `const loadData= store => store.dispatch(fetchUsers()) `
   
   This will return a promise. Since we might have more than one promise, we have to wait for all of them resolved. So I use **Promise.all()** inside express.js file
- When using Redux with server rendering, we must also send the state of our app along in our response, so the client can use it as the initial state. This is important because, if we preload any data before generating the HTML, we want the client to also have access to this data. Otherwise, the markup generated on the client won't match the server markup, and the client would have to load the data again.
- When we dump our store to the HTML template, we have to protect our app against xss attacks. 

        `export default (req, store) => {
         const content = renderToString(
           <Provider store={store}>
             <StaticRouter location={req.path} context={{}}>
               <div>{renderRoutes(Routes)}</div>
             </StaticRouter>
           </Provider>
         );
         return `
         <html>
         <head></head>
         <body>
         <div  id="root">${content}</div>
         <script>window.INITIAL_STATE=${serialize(store.getState())}</script>
         <script src="bundle.js"> </script>
         </body></html> `;
         };
        `

