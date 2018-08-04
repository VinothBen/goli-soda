install npm/yarn and node 
install eslint plugin in VS Code
Script Commands: 
 npm install --- Download all packages form npm repositry
 npm start --- This command will be used for development (inbuild react 16.0 webpack config)
 npm test --- This command for running component test cases
 npm eject --- ??
 npm dev --- This command will be used for development(Manually configured webpack settings                             "http://localhost:3000/")
 npm run build --- This command for productions build 
 mvn package --- To run react app in tomcat server(http://localhost:8080/property-buy-center/)
 mvn package -Pprod --- For Creating War file
 
Reff for Maven Config: https://www.megadix.it/blog/create-react-app-servlet/
Maven Example Code : https://github.com/megadix/create-react-app-servlet

Reff for WebPack Configuration : https://medium.freecodecamp.org/learn-webpack-for-react-a36d4cac5060


heroku deploy:war --war <war file location> --app <app name on heroku>