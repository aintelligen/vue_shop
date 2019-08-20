const Msg = options => {
  var request_Animation_Frame_opc = 1;
  var obj = Object.assign(
    {
      defaultClass: 'msg-masking-box_component',
      content: '',
      cb: function() {},
      durations: 1500
    },
    options
  );

  if (obj.content) {
    var classSelector = obj.class ? '.' + obj.defaultClass + '.' + obj.class : '.' + obj.defaultClass;
    var node = document.querySelector(classSelector);
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
    var actionNode = createNode(obj, classSelector);
    document.querySelector('body').appendChild(actionNode);
    setTimeout(() => {
      window.requestAnimationFrame(step);
    }, obj.durations - 500);

    function step() {
      request_Animation_Frame_opc += -0.05;
      actionNode.style.opacity = request_Animation_Frame_opc;
      if (actionNode.style.opacity < 1 && actionNode.style.opacity > 0) {
        window.requestAnimationFrame(step);
        if (actionNode.style.opacity == 0 || actionNode.style.opacity < 0) {
          actionNode.parentNode.removeChild(actionNode);
          obj.cb && obj.cb();
        }
      }
    }
  }
};

function createNode(obj) {
  var html = `<div style='padding:3px;white-space:nowrap;display:block;padding:0 20px;left:50%;top:50%;height:40px;line-height:40px;font-size:14px;text-align:center;color:#fff;position:fixed;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background-color:#131111;opacity:1;border-radius:5px;z-index:9999;'>${
    obj.content
  }</div>`;
  var div = document.createElement('div');
  div.style.position = 'fixed';
  div.className = obj.defaultClass;
  div.innerHTML = html;
  return div;
}

/* 
.msg-masking-box_component .show-masking {
  display: block;
  transition: hideMask 1.5s;
}
@keyframes hideMask {
  0% {
    opacity: 1;
  }
  20% {
    opacity: 0.8;
  }
  40% {
    opacity: 0.6;
  }
  60% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
    display: none;
  }
}
 */
export default Msg;
