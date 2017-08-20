# Jigsaw Any Badge [![powered by not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=powered by&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/jigsaw)

This is a full featured application including a web page based on [Jisgsaw七巧板](https://github.com/rdkmaster/jigsaw), and a back end based on [RDK](https://github.com/rdkmaster/rdk). It shows how to use Jigsaw with RDK to build an application.

It is strongly recommended to follow the Tour of Heroes([the official version](https://angular.io/tutorial) or [the version translated to Chinese](https://angular.cn/tutorial)) if you are new to Angular. After that, you can follow [Jigsaw Tourist](https://github.com/rdkmaster/jigsaw/blob/master/docs/tourist/index.md) to learn how to start to use Jigsaw, which explains how to use Jigsaw step by step in detail.

After learning the two tourists, you are ready to learn how to build a full featured application with Jigsaw七巧板 and RDK, the code hosted in this project shows you the best way to do this. Considering that you are now an experienced Angular and Jigsaw developer, this project will not tell you how to build the application step by step, but only shows you the code, most of which has detailed explaination.

## install
Executing the following script:
```
git clone https://github.com/rdkmaster/any-badge.git
cd any-badge
npm config set proxy=http://proxy.zte.com.cn:80                          # do this if neccessary
npm config set registry=https://registry.npm.taobao.org/                 # for Chinese developers only
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass # for Chinese developers only
npm install -g @angular/cli                                              # optional, but strongly recommended
npm install
npm start
```

