# Universal-Javascript
- In universal Javascript, we should be able to use the exact same coding style on both client-side and server-side. Node.js has no support for Es2015. However we are running webpack and babel over our entire codebase. So we can use es2015 modules in node.js.
- We have to convert our server code to a string and then send it to the browser. This code has no functionality. Browser will hydrate it. That means it will breathe life into that code. it will restore all the event handlers so our code will turn to be a normal react app.
- We have to make sure that we never ever export any server-side code into any file that will be eventually sent out to the browser. That is why we have 2 distinct bundle.js. We ship client-side bundle to the browser not server-side. since we have two webpack config files, we have to merge them to avoid repeating the code. I used [webpack-merge](https://www.npmjs.com/package/webpack-merge)
- With node unlike the browser, we can require node modules at runtime when our server first starts up. So we need to keep webpack from importing our libraries into our server bundle.js. It will reduce our bundle-size.
  in our dev.config.js (we use node.js syntax inside webpack config files)
  
`const nodeWebExternals=require("webpack-node-externals")`

`externals:[nodeWebExternals()]`
  
## Navigation
- express.js is not going to enforce any routing rules on any incoming requests. Instead it will delegate all routing inside of our application to the react-router. For anything that is meant to show HTML we are always going to make sure that react-router is in charge of that request.
- StaticRouter is specifically made for use on the server-side-rendering. When we do the initial render of app, we use StaticRouter. After our application is shipped down to the browser and it gets hydrated, we will swap out to be using BrowserRouter.
- BrowserRouter does not work on the server because there is no address bar on the server. BrowserRouter is hardcoded to expect an address. It is designed to look at the URL in the browser's address bar.
- We have to tell StaticRouter which component should be rendered upon the request. It has location prop and we pass the `req.path`. it also has `context` prop which is an object, we will be using for the rendering pageNotFound page and redirecting routes on the server.

## Redux
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
- Inside UsersList and AdminsList page, inside componentDidMount() we fetched users and admins. componentDidMount() is invoked by only browser. The reason is if a user request some other routes besides /users and /admins, server will render our app without invoking the loadData functions inside those componnets. Imagine the user requests for "/" route, our server renders the app, since those components are not necessary to load the Home component, loadData functions inside those two components will not be invoked. Then if the user navigates to the "/users", we should be fetching users by the react-client side. Universal javascript means same code executed on the server, should be executed on the browser too.

## Authentication
- Our server is going to be responsible for making API requests during the server rendering phase. We are gonna make authenticating request to do things like access that list of admins, that means our server is now going to need some type of knowledge of exactly who is attempting to access the Api and the server itself needs to be able to somehow fool the Api into thinking that it is the user’s browser who is making the request.
- After the user goes through the oauth process, the API then assigns an identifier to the user’s cookie. Then any follow-up requests made from the user’s browser to the API automatically gets that a cookie attached to it. So the API always knows who is making the request. 
-we cannot make request from browser to the api that does not share the same origin. so we need to setup a proxy server on our server. So rather than sending user's browser directly to the Api, we send the user to the proxy that running on our server. Proxy will forward that request for authentication to the Api. After a cookie is issued by the Api, the proxy will then send that cookie back to the browser. Browser does not know that Api server exists.  The browser has a proxy that is invisibly sending the requests out to the API server.  So any follow up requests being made to the render server (express) will include that original authentication cookie that had been issued by the API before. Then the render server will make all the needed requests to the API and manually attach the cookie onto that request to prove that the user is authenticated. 
 
![communication between api and browser](https://github.com/yilmazbingo/Universal-Javascript/blob/master/img.jpeg.ps)
-The proxy will not be active in the initial phase. The server is going to make requests on behalf of the browser. So we are going to somehow manually attach the cookie that got sent from the original page load request to the  request over to the Api. so after that initial page load, any follow up requests are going to be issued directly from the browser. So this is where proxy is going to start to come into play. Proxy is active in the follow up request. During this phase, the server will no longer touch or modify incoming requests. It will simply pass requests onto the API through the use of a proxy server. 
- Sending JWT token to the server is not automatic. That is why we use cookies here. The COOKIES ALWAYS WILL BE ATTACHED AUTOMATICALLY TO THE request.
### Proxy Setup
`app.use("/api",
 proxy("http://react-ssr-api.herokuapp.com/", {
   proxyReqOptDecorator(opts) {
     opts.header["x-forwarded-host"] = "localhost:3000";
     return opts; }}));
`
- after we make request to the "http://react-ssr-api.herokuapp.com/" we go through google oauth process and we want the google redirect us to the localhost:3000 with this option: 
          opts.header["x-forwarded-host"]="localhost:3000"  
### Actions, Axios and Redux-Thunk
- I use [axios library](https://www.npmjs.com/package/axios) for making api requests. Axios behaves slightly differently depending on whether it is running on the client or on the server. We need to customize the configuration of axios depending on whether we are running it on the client or the server
- Since reducers are supposed to be “pure” (they don’t change anything outside their scope) we can’t do any API calls or dispatch actions from inside a reducer. If you want an action to do something, that code needs to live inside a function. Normally our actions are just plain objects, we just dispatch them to the reducer directly. **Redux-thunk** is a middleware that looks at every action that passes through the system, and if it’s a function, it calls that function.  Redux will pass two arguments to thunk functions: **dispatch**, so that they can dispatch new actions if they need to; and **getState**, so they can access the current state. **REdux-thunk** middleware gives us the ability for an action creator to return a function instead of an action object.
- When we create each of redux store copies, we also create a custom instance of axios and pass that custom instance into redux thunk as an extra third argument. Then in our action creators whenever we try to make some type of network request, we will receive the customized copy of axios rather than the actual module itself. Then we can make request without actually worry about whether we are on the client or on the server.

Here is the source code of redux-thunk:
                  
          
thunk is a middleware that extra argument is not defined. thunk.withExtraArgument is the middleware that extra argument is defined. So we are going to use the thunk.withExtraArgument and we will pass the axios instances. 

    `
      function createThunkMiddleware(extraArgument) {
            return ({ dispatch, getState }) => next => action => {
              if (typeof action === 'function') {
                return action(dispatch, getState, extraArgument);
              }
              return next(action);
            };
          }
          const thunk = createThunkMiddleware();
          thunk.withExtraArgument = createThunkMiddleware;

          export default thunk;
          `
       
   thunk is a middleware that extraArgument is not defined. It just has dispatch and getState methods. We pass axios instances to thunk.withExtraArgument.
   
  ### Client Axios Instance and thunk
  `const axiosInstance = axios.create({
 baseURL: "/api"}); //this will we be proxied
const store = createStore(
 reducers,
 window.INITIAL_STATE,
 applyMiddleware(thunk.withExtraArgument(axiosInstance)));
`
### Server Axios Instance and thunk

`export default req => {
 const axiosInstance = axios.create({
   baseURL: "http://react-ssr-api.herokuapp.com/",
   headers: { cookie: req.get("cookie" || "") }
 });
 const store = createStore(
   reducers,{},applyMiddleware(thunk.withExtraArgument(axiosInstance))
 );
 return store;};
`
-We need to make sure that the cookie that comes in from the initial request is going to be stripped from that request and attached onto the requests that axios makes the API. that is why we passed the req argument. 

## Error Handling
### NotFound Page on the server
- When a user enters a not found url, we want to send 404 response to the browser. We are going to use the `context` prop of the StaticRouter. this prop which is an object gives ability to StaticRouter to communicate with the rendered components. StaticRouter pass this object down to the any component that it renders. So we create a notFound page and receives that prop as **staticContext**. Then we add an error property to this pbject inside notFound page.

          `
          const NotFoundPage = ({ staticContext = {} }) => {
            console.log("StaticContext", staticContext);
            staticContext.notFound = true;
            return <h1>Ooops, Not Found</h1>;
          };

          export default { component: NotFoundPage };
          `
Now, if a user enters url, StaticRouter will dive into this page and will update **context** object with the "notFound" property. Inside express.js file where we set up our route, we are gonna add a logic to investigate the context object.

          ` if (context.notFound) {
                  res.status(404);
                }`
                
- In server-side rendering, we wait all the async fetching operations to finish before we render our app. If something goes wrong during the server-side rendering, we should not quit and just send a message. 
      `Promise.all(promises).then().catch(()=>{res.send(“Something went wrong”)}) //Do not do this
      `
We should still attempt to render our app. But always attempting to render the app does not mean this:
      `Promise.all(promises).then(render).catch(render)`
      
Promise.all takes an array of the promises and as soon as one of the promises rejected, it goes to the catch function. As you know, promises have 3 states: Pending, Fullfilled,Rejected. when one of the promises rejected, there might be some other promises that in pending state but Promise.all() will not wait for pending promises and will go to the catch function immediately. So we will be rendering our early. 
      Solution is, we are going wrap each promise with a promise. So each loadData() promise will have one outer promise. So Promise.all() will take the outer of the promisess.  if inner promise is either resolved or rejected we will assume its outer promise as resolved. With this approach, we will not render our app early, we will be waiting all of the inner promises either resolved or rejected.
      
      `
      const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    }) // route.loadData(store) returns promise. now we wrap this with a promise
    .map(promise => {
      if (promise) {
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
    });
      `

### Creating Protected Routes
- We wanna show some pages only to the authenticated users. For this we use normal HOC. there is nothing special. However, if the user is not authneticated, we have to redirect it to a different route, and this is a little bit different on the server-side. For redirecting we are going to use the `context` prop of the StaticRouter. When we show the Redirect component on the server, our staticRouter is going to add a new "url" property to our context object. in express.js we add this logic:

          `
          if (context.url) {
                  return res.redirect(301, context.url);
                }
          `
The HTTP response status code 301 Moved Permanently is used for permanent URL redirection.

## Optimizing SEO
- OPEN GRAPH PROTOCOL:  [Here is the website](https://ogp.me/) :this gives applications like Facebook, Linkedin, Google so on the ability to parse the content on your page and put together a very quick description of what your page is all about when it gets linked to one of those services. 

- Whenever a user visits the Home page on some service Twitter-FB-Linkedin, that service will have some type of bot running in the background that will automatically access our page and scrape those meta tags out of the generated HTML that we send them. So for each page or for each route inside of our application, we want to have the ability to configure the tags that are displayed inside the header. These tags are only accessed by these bots that scrape our page from the html that gets sent from the initial page request.
- I use [react-helmet library](https://www.npmjs.com/package/react-helmet) and it behaves differently in server-side rendering applications. When we render our application on the server we do not even have a head tag around. Instead we are going to render our helmet tag. Helmet is going to kind of store all those changes to the head tag that we want to make and after we render our application we are going to tell helmet to give us access to all the tags that it just generated and we are going to manually dump all those tags into the HTML template. in usersLists page, I created the tags and Helmet stored them. In helpers/renderer.js I accessed them via helmet and dumb them to the HTML template.



      
