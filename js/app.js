import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.myapp', // App bundle ID
  name: 'test', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },

    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },


  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});
$$(document).on('page:init', '.page[data-name="nazwiska"]', function(e) { //zdarzenie otwarcia strony z wirtualną listą

    axios
        .get('http://localhost/cgi-bin/program.cgi/data') //api url
        .then(response => {
            console.log(response.data);
            var virtualList = app.virtualList.create({
                // List Element
                el: '.virtual-list',
                // Pass array with items
                items: response.data, //JSON z api
                // Custom search function for searchbar
                searchAll: function(query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; //return array with mathced indexes
                },
                // List item Template7 template
                itemTemplate: '<li>' +
                    '<a href="#" class="item-link item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{title}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{subtitle}}</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                // Item height
                height: app.theme === 'ios' ? 63 : (app.theme === 'md' ? 73 : 46),
            });
        });
});
// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});