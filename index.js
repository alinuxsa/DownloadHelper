const ui = require("ui");
const input = require("input");
const clipboard = require("clipboard");
const { DownloaderHelper } = require('node-downloader-helper');
var text = clipboard.text();
var link = '';
const share = require("share");
const fs = require("fs");

if (text.startsWith('http')) {
  ui.alert({
    title:"是否使用剪切板内容作为连接?",
    message: text,
    actions: ["是", "否"]
  }).then(actions => {
    if (actions.index == 0){
     link = text;
     DownloadFile(link)
    }else{
      input.text({
        type: 0,
        placeholder: "输入下载连接",
      }).then(text => {
        link = text;
      })
    }
  });
}else{
  InputLink()
}



function InputLink(){
  input.text({
    type: 0,
    placeholder: "输入下载连接"
  }).then(text => {
    link = text
    DownloadFile(link)
  })
}

function DownloadFile(link){
  const dl = new DownloaderHelper(link,"./download");
  dl.on('download', downloadInfo => console.log('开始下载: ',
  {
      name: downloadInfo.fileName,
      total: downloadInfo.totalSize
  }));
  dl.on('progress',stats => ui.showProgress(stats.progress.toFixed() / 100,"下载中.."));
  dl.on('end', downloadInfo => {
    const buffer = fs.readFileSync("./download/"+ downloadInfo.fileName);
    share.file({
      name: downloadInfo.fileName,
      data: buffer
    });
  });
  // dl.on('end', downloadInfo => ui.success(downloadInfo.fileName,"下载完成!"));
  dl.start();
}