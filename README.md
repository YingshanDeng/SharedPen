# SharedPen
A real time collaborative editor using CodeMirror and ot.js.
![](http://7vikhl.com1.z0.glb.clouddn.com/sharedpen.png)
SharedPen is still in Development, fork and pull-requests are welcome! 😋

## Development
```
npm install
cd examples/react-demo
npm install
```

### setup sharedpen source files
```
# path: root
gulp serve
```

- watch sharedpen source files' change
- compile them to `build` dir
- serve them (port: 5000)

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

### setup react-demo
```
cd examples/react-demo
yarn start
```

- serve demo's static files(port: 3000)

Open in Browser, debug the SharedPen client side code:
```
http://localhost:3000/
```

## Bundle
### bundle SharedPen lib
```
npm run bundle
```

### bundle SharedPen React Demo
```
cd examples/react-demo
yarn build
```

## License
MIT
