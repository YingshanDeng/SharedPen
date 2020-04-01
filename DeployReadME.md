部署教程：

### 静态文件构建
```
npm install
npm run build
npm run bundle

cd examples/react-demo/
npm install
yarn build
```

### 启动 node 服务器
```
nohup node examples/server.js >> examples/server.log 2>&1 &
```

### nginx 配置
```
vim /usr/local/nginx/conf/nginx.conf
```

```
server {
  listen       80;
  server_name  120.79.79.227;
  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 8k;
  gzip_http_version 1.1;
  gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml;

  location / {
    root /root/SharedPen/examples/react-demo/build/;
  }
  location /socket.io/ {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://localhost:4000;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

```
/usr/local/nginx/sbin/nginx -t
/usr/local/nginx/sbin/nginx -s reload
```
