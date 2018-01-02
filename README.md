# SharedPen
A real time collaborative editor using CodeMirror and ot.js

## Development
```
npm install
cd examples/polymer
npm install
bower install
```

### setup sharedpen source files
```
# path: root
gulp serve
```

- watch sharedpen source files' change
- compile them to `build` dir
- serve them (port: 3000)

### setup sharedpen server(socket.io)
```
# path: root
node --inspect examples/server.js
```

- setup socket.io(port: 4000)

Open in Chrome, debug the SharedPen server side code:
```
chrome://inspect/#devices
```

### setup polymer-demo static files
```
# path: example/polymer
polymer serve --port 5000
```

- serve demo's static files(port: 5000)

Open in Browser, debug the SharedPen client side code:
```
http://127.0.0.1:5000
```

## Bundle
### bundle SharedPen lib
```
npm run bundle
```

### bundle SharedPen Polymer Demo
```
npm run bundle-polymer-demo
```

You should install polymer-cli first:
```
npm install -g polymer-cli
```

## License
MIT
