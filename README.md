# Jigsaw Any Badge [![powered by not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=powered%20by&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/jigsaw)

## Need More Badge?
If the answer is 'Yes', Any Badge is the best choice, you can make any badges you want, and put them to your project hosted like github or gitlab in minutes, update the status of your badges within your CI system or manually anytime and anywhere. Here is some badges using by [Jigsaw七巧板](https://github.com/rdkmaster/jigsaw):

[![documentation not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=documentation&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdkmaster.com/jigsaw/doc/coverage.html)
[![components not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=components&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdk.zte.com.cn/component)
[![directives not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=directives&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdk.zte.com.cn/component)
[![injectables not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=injectables&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdk.zte.com.cn/component)
[![demo not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=demo&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdk.zte.com.cn/component)
[![e2e testcases not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=e2e%20testcases&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](http://rdk.zte.com.cn)

And, we made some more badges maybe useful too:

[![License not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=License&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/any-badge)
[![Powered-by not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=Powered-by&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/any-badge)
[![stars not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=stars&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/any-badge)
[![Loving not found](http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=Loving&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l)](https://github.com/rdkmaster/any-badge)

## Getting Started
[here](http://rdk.zte.com.cn/jigsaw/any-badge/guides/getting-started)

## About Any Badge

This is a full featured application including a web page based on [Jisgsaw七巧板](https://github.com/rdkmaster/jigsaw), and a back end based on [RDK](https://github.com/rdkmaster/rdk). It shows how to use Jigsaw with RDK to build an application.

It is strongly recommended to follow the Tour of Heroes([the official version](https://angular.io/tutorial) or [the version translated to Chinese](https://angular.cn/tutorial)) if you are new to Angular. After that, you can follow [Jigsaw Tourist](https://github.com/rdkmaster/jigsaw/blob/master/docs/tourist/index.md) to learn how to start to use Jigsaw, which explains how to use Jigsaw step by step in detail.

After learning the two tourists, you are ready to learn how to build a full featured application with Jigsaw七巧板 and RDK, the code hosted in this project shows you the best way to do this. Considering that you are now an experienced Angular and Jigsaw developer, this project will not tell you how to build the application step by step, but only shows you the code, most of which has detailed explaination.

## Development
Execute the following script to setup the front-end develop environment:
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


