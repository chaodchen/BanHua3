importClass(android.content.Intent);
importClass(android.net.Uri);
importClass(android.provider.Settings);


//这里的项目自己进行配置
bh.主题颜色 = "#FFC0CB";
bh.标题 = "这个是我的标题";
bh.副标题 = "让各位开发者用上好看的模板";
bh.公告 = "1.班花模板3.0全新上限\n2.新增网络验证系统\n3.去掉悬浮窗运行脚本功能，如有需要，请自行在script.js进行编写\n4.此模板仅供内部测试交流！";
bh.pjy = true;


//加载UI框架
bh.drawUiFrame();

//添加公告卡片
bh.addUiContent(
    <frame>
        <vertical>
            {/* 脚本公告配置区域 */}
            <vertical>
                <text gravity='center' text='公告' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{bh.主题颜色}}'></text>
                <text padding='8dp' text='{{bh.公告}}'></text>
            </vertical>
        </vertical>
    </frame>, "home"
);

//添加设置权限卡片
bh.addUiContent(
    <frame>
        <vertical>
            <text gravity='center' text='权限服务' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{bh.主题颜色}}'></text>
            <Switch id='autoService' text='*无障碍服务' padding='8dp' textSize='15sp' checked='{{auto.service != null}}'></Switch>
            <Switch id='windowService' text='悬浮窗服务' padding='8dp' textSize='15sp'></Switch>
            <Switch id='rootService' text='Root服务' padding='8dp' textSize='15sp' checked='{{bh.isSuEnable()}}'></Switch>
            <Switch id='deBugService' text='调试服务' padding='8dp' textSize='15sp'></Switch>
        </vertical>
    </frame>, "setTing"
);

//如果泡椒云开启，就添加会员卡片
if (bh.pjy) {
    pjyUser = null;
    bh.addUiContent(
        <frame>
            <vertical>
                <text gravity='center' text='用户' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{bh.主题颜色}}'></text>
                <vertical padding='8dp'>
                    <horizontal>
                        <text text='到期时间：'></text>
                        <text id='endTime'></text>
                    </horizontal>
                    <horizontal>
                        <text text='设置卡密：'></text>
                        <input id='bh_kami' w='*'></input>
                    </horizontal>
                    <horizontal>
                        <button id='denglu' text='登陆' layout_weight='1'></button>
                        <button id='jiebang' text='解绑' layout_weight='1'></button>
                        <button id='chongzhi' text='充值' layout_weight='1'></button>
                        <button id='tuichu' text='退出' layout_weight='1'></button>
                    </horizontal>
                </vertical>
            </vertical>
        </frame>, "setTing"
    );

    //创建按键的点击事件
    ui.denglu.on('click', () => {
        bh.storage.put("bh_kami", ui.bh_kami.text());
        threads.start(bh.pjyLoginFun);
    });

    ui.jiebang.on('click', () => {
        threads.start(bh.pjyJiebangFun);
    });

    ui.chongzhi.on('click', ()=> {
        threads.start(bh.pjyChongzhiFun);
    });

    ui.tuichu.on('click', ()=> {
        threads.start(bh.pjyTuichuFun);
    });
    
    threads.start(bh.pjyLoginFun);

    // 监听心跳失败事件
    pjysdk.event.on("heartbeat_failed", function(hret) {
        log("心跳失败，尝试重登...")
        sleep(2000);
        let login_ret = pjysdk.CardLogin();
        if (login_ret.code == 0) {
            log("重登成功");
        } else {
            toastLog(login_ret.message);  // 重登失败
            sleep(200);
            exit();  // 退出脚本
        }
    });

    // 当脚本正常或者异常退出时会触发exit事件
    events.on("exit", function(){
        pjysdk.CardLogout(); // 调用退出登录
        log("结束运行");
    });
}

//添加手机设置卡片
bh.addUiContent(
    <frame>
        <vertical>
            <text gravity='center' text='手机配置' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{bh.主题颜色}}'></text>
            <text id='deviceConfig' padding='8dp' text='{{bh.getDeviceConfig()}}'></text>
        </vertical>
    </frame>, "setTing"
);

//最后再添加脚本内容卡片
bh.addUiContent(
    <vertical>
        <text gravity='center' text='脚本功能' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{bh.主题颜色}}'></text>
        <vertical padding='8dp'>
            <horizontal>
                <text text='账号：'></text>
                <input w='*' id='bh_user' hint='账号'></input>
            </horizontal>
            <horizontal>
                <text text='密码：'></text>
                <input w='*' id='bh_user' hint='密码' inputType='textPassword'></input>
            </horizontal>
            <horizontal>
                <text text='年龄：'></text>
                <input w='*' id='bh_old' hint='输入年龄' inputType='number'></input>
            </horizontal>
            <horizontal>
                <text text='性别：'></text>
                <spinner w='*' id='bh_sp1' entries='男生|女生|人妖'></spinner>
            </horizontal>
            <horizontal>
                <text text='职业：'></text>
                <checkbox id='bh_xs' text='学生'></checkbox>
                <checkbox id='bh_sbz' text='上班族'></checkbox>
                <checkbox id='bh_bm' text='宝妈'></checkbox>
                <checkbox id='bh_lb' text='老板'></checkbox>
            </horizontal>
            <radiogroup orientation='horizontal'>
                <text text='伴侣：'></text>
                <radio id='bh_ra1' text='迪丽热巴'></radio>
                <radio id='bh_ra2' text='郑爽'></radio>
                <radio id='bh_ra3' text='张靓颖'></radio>
            </radiogroup>
        </vertical>
    </vertical>, "home"
);

//开始读取并设置UI内容
bh.getUiConfig(bh.getXmlOfId(bh.home));
bh.getUiConfig(bh.getXmlOfId(bh.setTing));

//无障碍服务单击事件
ui.autoService.on('click', () => {
    ui.autoService.isChecked() ? auto.service == null ? app.startActivity({action: "android.settings.ACCESSIBILITY_SETTINGS"}) : log('无障碍处于打开状态') : auto.service == null ? log('无障碍处于关闭状态') : auto.service.disableSelf();
});

//悬浮窗服务单击事件
ui.windowService.on('click', () => {
    if (ui.windowService.isChecked()) {
        log("打开悬浮窗服务");
        var intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:" + context.getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        app.startActivity(intent);
    } else {
        log("关闭悬浮窗服务");
    }
});

//Root权限单击事件
ui.rootService.on('click', () => {
    if (ui.rootService.isChecked()) {
        log("打开Root权限");
        shell("", true);
    } else {
        log("关闭Root权限");
    }
});

//调试服务单击事件
ui.deBugService.on('click', () => {
    if (ui.deBugService.isChecked()) {
        log("开启调试窗口");
        console.show();
    } else {
        log("关闭调试窗口");
        console.hide();
    }
});

//回到本界面时，触发resume事件
ui.emitter.on('resume', ()=> {
    toastLog("欢迎回来！");
    auto.service == null ? ui.autoService.setChecked(false) : ui.autoService.setChecked(true);
});

//监听开始事件
ui.fab.on('click', ()=> {
    
    //保存控件信息
    bh.putUiConfig(bh.getXmlOfId(bh.home));
    bh.putUiConfig(bh.getXmlOfId(bh.setTing));

    if (bh.scriptTh == null || !bh.scriptTh.isAlive()) {
        //开始判断需要会员吗
        if (bh.pjy) {
            if (pjyUser.code == 0) {
                log("尊敬的会员用户，欢迎您！");
                bh.scriptTh = threads.start(function() {
                    let script = bh.getJgy("script.js").str();
                    eval(script);
                });
            } else {
                // log("失败~请使用卡密激活此软件！");
                toastLog(pjyUser.message);
            }
        } else {
            //不需要网络验证
            bh.scriptTh = threads.start(function() {
                let script = bh.getJgy("script.js").str();
                eval(script);
            });
        }
    } else {
        toastLog("哎呀，疼~");
    }
});

//监听退出事件
ui.fab2.on('click', ()=> {
    toastLog("退出软件");
    ui.finish();
});