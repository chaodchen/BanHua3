"ui";
/**
 * 【前言】
 *      1.这里是程序入口，也是客户端文件，也就是将来要打包打给客户的文件
 *      2.如果技术不佳，不建议改动此文件的除必要配置外相关代码
 *      3.其他参数配置如软件标题、副标题、颜色等最好在mainActivity.js去定义
 *      4.如需自动保存UI配置，需要在ID命名的时候加上bh_，如<input id="bh_input">
 *      5./mod/路径为自定义模块存放路径，可通过bh.require("mod/mod.js")来进行调用
 *      6.感谢坚果云【http://jianguoyun.com】提供免费云盘支持
 *      7.感谢泡椒云【http://paojiaoyun.com】提供免费用户验证系统支持
 *      8.该项目开源地址【https://github.com/DHC8023/BanHua3】
 *      9.该项目视频教程【https://www.bilibili.com/video/BV11f4y1673k/】
 * 
 * 【序章】
 *      1.当前版本【3.1.1】更新内容：
 *          1.【优化】相关代码已移至mainActivity.js
            2.【优化】简洁部分代码
            3.【新增】new BH()新增了两个参数
            4.【优化】混淆加密部分关键代码

    【文档】
        bh.starts()                                     -->>  启动mainActivity脚本
        bh.getViewContent(name)                         -->>  读取ID为name的控件信息，通常在script里进行使用，来读取mainActivity里的控件信息
        bh.pjy                                          -->>  是否启用泡椒云网络验证，如需启用【bh.pjy = true】并在new BH()里填写相关参数即可
        new BH(user, key, path , [pjykey, pjysokect])   -->>  new BH(坚果云帐号, 坚果云密钥, 该项目在坚果云的相对路径, [泡椒云key, 泡椒云sokect]);
        bh.drawUiFrame()                                -->>  加载UI框架
        bh.addUiContent(xml, id)                        -->>  在指定ID布局中添加xml代码
        bh.getXmlOfId(xml)                              -->>  获取xml代码或字符串中所有的id名称，返回值为数组类型
        bh.getUiConfig(ids)                             -->>  获取本地储存保存的控件信息，并对ids的id数组变量进行设置控件信息
        bh.putUiConfig(ids)                             -->>  获取当前界面上所有ids控件的内容，并保存到本地储存
        bh.getJgy(path)                                 -->>  获取坚果云文件，参数为坚果云相对路径，返回一个对象，具有code属性，如果为0就是获取成功，否则获取失败

    【最后】
        开发者：1947180472
        官方交流群：27521835
        官方店铺：https://item.taobao.com/item.htm?ft=t&id=614592499147
        
        
 *      
 */

//声明班花变量
const BH = (function(){
    function BH (user, key, path, pjyKey, pjySecret) {
        http.__okhttp__.setMaxRetries(0);
        http.__okhttp__.setTimeout(10*1000);

        this.user = user;
        this.key = key;
        this.path = path;
        //默认主题
        this.主题颜色 = "#FFC0CB";
        this.主题背景 = "";
        this.标题 = "AutoJs";
        this.副标题 = "这个是副标题";
        this.卡片背景 = "暂时弃用";
        this.卡片圆角 = "15dp";
        this.卡片外边距 = "10dp";
        this.卡片高度 = "15dp";
        this.卡片内边距 = "5dp";
        this.公告 = "欢迎使用该模板！\n仅供测试。";
        this.悬浮窗 = true;
        //是否开启泡椒云网络验证
        this.pjy = true;
        //定义坚果云API
        this.jianGuoYunApi = "http://dav.jianguoyun.com/dav/";
        this.storage = storages.create(this.getJgyProjectName(path , 2));
        this.home = "";
        this.setTing = "";
        this.pjyKey = pjyKey;
        this.pjySecret = pjySecret;
        //脚本线程
        this.scriptTh = null;
        this.runScriptTh = null;
    }
    
    eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('K.X.S=7(e){f h=6.q+6.u+e;f 4=v.t(h,{r:{"s":"z "+a.b.9(A.y.w.x(a.b.9(6.k+\':\'+6.o).p(),2)),"l-m":"n/i;j=B-8","T":"U-P","Q-R":"V","Z-10":"W/3.Y.1"}});O(4!=F&&4.c>=G&&4.c<=H){5{g:0,C:7(){5 4.d.D()},E:7(){5 4.d.L()}}}M{N.I("J！");5{g:1}}}',62,63,'||||_0|return|this|function||String|java|lang|statusCode|body|filesName|let|code|_1|plain|charset|user|Content|Type|text|key|getBytes|jianGuoYunApi|headers|Authorization|get|path|http|Base64|encode|util|Basic|android|UTF|str|string|bys|null|200|300|error|获取坚果云文件失败|BH|bytes|else|console|if|Alive|Accept|Encoding|getJgy|Connection|Keep|gzip|okhttp|prototype|12|User|Agent'.split('|'),0,{}));


    BH.prototype.getJgyProjectName = function (_path, _num) {
        _num = _num || 1;
        if (_path.indexOf('/') == -1) {
            return _path;
        } else {
            _s_name = _path.split('/');
            return _s_name[_s_name.length - _num];
        }
    }

    BH.prototype.require = function (modName) {
        let _res = this.getJgy (modName);
        if (_res.code == 0) {
            files.writeBytes("./"+this.getJgyProjectName(modName), _res.bys());
            return require(this.getJgyProjectName(modName));
        } else {
            console.error("【require】code：%s", _res.code);
            return null;
        }
    }

    BH.prototype.isSuEnable = function (_num) {
        //_num用来判断检测root权限的严谨性,0为严谨模式
        if (_num == 0) {
            var file = null;
            var paths = ["/system/bin/", "/system/xbin/", "/system/sbin/", "/sbin/", "/vendor/bin/", "/su/bin/"];
            try {
                for (let path in paths) {
                    let file = new java.io.File(paths[path] + "su");
                    if (file.exists() && file.canExecute()) return true;
                }
            } catch (x) {
                toast("错误" + x);
            }
            return false;
        } else if (_num == 1) {
            if (shell("", true).code == 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    BH.prototype.getDeviceConfig = function () {
        let str = "";
        str += "屏幕宽度:" + device.width;
        str += "\n屏幕高度:" + device.height;
        str += "\nbuildId:" + device.buildId;
        str += "\n主板:" + device.board;
        str += "\n制造商:" + device.brand;
        str += "\n型号:" + device.model;
        str += "\n产品名称:" + device.product;
        str += "\nbootloader版本:" + device.bootloader;
        str += "\n硬件名称:" + device.hardware;
        str += "\n唯一标识码:" + device.fingerprint;
        str += "\nIMEI: " + device.getIMEI();
        str += "\nAndroidId: " + device.getAndroidId();
        str += "\nMac: " + device.getMacAddress();
        str += "\nAPI: " + device.sdkInt;
        str += "\n电量: " + device.getBattery();
        return str;
    }

    BH.prototype.getXmlOfId = function (_xmlStr) {
        //获取xml文件所有id名称返回数组
        let _arr = _xmlStr.match(/bh_[_0-9a-zA-Z]+['$"$]/g);_b = [];
        for (_a in _arr) {
            let _c = _arr[_a].replace(/['"]/g, "");
            _b.push(_c);
        }
        return _b;
    }

    BH.prototype.putUiConfig = function (ids) {
        ids.forEach((idName) => {
            if (ui[idName].toString().indexOf("EditText") > -1) {
                this.storage.put(idName, ui[idName].text());
            } else if (ui[idName].toString().indexOf("CheckBox") > -1) {
                this.storage.put(idName, ui[idName].isChecked());
            } else if (ui[idName].toString().indexOf("Spinner") > -1) {
                this.storage.put(idName, ui[idName].getSelectedItemPosition())
            } else if (ui[idName].toString().indexOf("Radio") > -1) {
                this.storage.put(idName, ui[idName].isChecked());
            } else {
                console.error("【%s】该类型的控件不支持保存", idName);
            }
        });
    }
    
    BH.prototype.getUiConfig = function (ids) {
        ids.forEach((idName) => {
            // log("正在设置【%s】", idName);
            if (ui[idName].toString().indexOf("EditText") > -1) {
                ui[idName].setText(this.storage.get(idName) || "");
            } else if (ui[idName].toString().indexOf("CheckBox") > -1) {
                ui[idName].checked = this.storage.get(idName) || false;
            } else if (ui[idName].toString().indexOf("Spinner") > -1) {
                ui[idName].setSelection(this.storage.get(idName) || 0);
            } else if (ui[idName].toString().indexOf("Radio") > -1) {
                ui[idName].checked = this.storage.get(idName) || false;
            } else {
                console.error("【%s】该类型的控件不支持设置控件信息", idName);
            }
        });
    }
    

    BH.prototype.getViewContent = function (_name) {
        return this.storage.get(_name);
    }

    BH.prototype.drawUiFrame = function () {
        ui.layout(
            <frame w='*' h='*'>
                <fab layout_gravity='right|bottom' id='fab' margin='15dp' layout_width='wrap_content' layout_height='wrap_content' backgroundTint='{{bh.主题颜色}}' elevation='5dp' src="@drawable/ic_send_black_48dp" color='{{bh.主题颜色}}'></fab>
                <fab layout_gravity='left|bottom' id='fab2' margin='15dp' layout_width='wrap_content' layout_height='wrap_content' backgroundTint='{{bh.主题颜色}}' elevation='5dp' src="@drawable/ic_power_settings_new_black_48dp" color='{{bh.主题颜色}}'></fab>
                <vertical>
                    <appbar bg='{{bh.主题颜色}}'>
                        <toolbar id='toolbar' title='{{bh.标题}}' subtitle='{{bh.副标题}}' bg='{{bh.主题颜色}}'/>
                        <tabs id='tabs'></tabs>
                    </appbar>
                    <viewpager id='viewpager'>
                        <ScrollView>
                            <vertical id='home'></vertical>
                        </ScrollView>
                        <ScrollView>
                            <vertical id='setTing'></vertical>
                        </ScrollView>
                    </viewpager>
                </vertical>
            </frame>
        );
        ui.viewpager.setTitles(["首页", "设置"]);
        //绑定标签栏
        ui.tabs.setupWithViewPager(ui.viewpager);

        //设置状态颜色
        ui.statusBarColor(bh.主题颜色);

    }

    BH.prototype.addUiContent = function (_xml, _id) {
        //添加UI配置到指定界面
        _card = <card h='auto' w='*' cardCornerRadius={this.卡片圆角} margin={this.卡片外边距} cardElevation={this.卡片高度} padding={this.卡片内边距}>
            {_xml}
        </card>
        ui.inflate(_card, ui[_id], true);
        this[_id] = this[_id] + _xml;
    }

    //泡椒云登陆函数
    BH.prototype.pjyLoginFun = function () {
        //登陆线程
        ui.run(() => {
            ui.endTime.setText("登陆中...");
        });
        let kami = ui.bh_kami.text();
        if (kami != "" && kami != null) {
            console.info("读取到了卡密:%s", kami);
            //开始判断卡密是否过期
            pjysdk.SetCard(kami);
            pjyUser = pjysdk.CardLogin();
        } else {
            console.info("未读取到卡密，开始试用登陆");
            pjyUser = pjysdk.TrialLogin();
        }
        ui.run(function(){
            if (pjyUser.code == 0) {
                ui.endTime.setText(pjyUser.result.expires);
            } else {
                ui.endTime.setText(pjyUser.message);
            }
        });
    }

    BH.prototype.pjyChongzhiFun = function () {
        let user_card =  rawInput("请输入充值卡密：");
        let card = ui.bh_kami.text();
        let value =  confirm("确定将此卡充值到【"+card+"】吗");
        if (value) {
            let res = pjysdk.CardRecharge(card, user_card);
            if (res.code == 0) {
                toastLog("充值成功！");
                ui.run(function(){
                    bh.pjyLoginFun();
                })
            } else {
                toastLog(res.message);
            }
        } else {
            toastLog('您取消了本次充值！');
        }
    }

    BH.prototype.pjyJiebangFun = function () {
        let res = pjysdk.CardUnbindDevice();
        if (res.code == 0) {
            toastLog("解绑成功！");
            ui.run(function(){
                ui.bu_kami.setText('');
            })
        } else {
            toastLog(res.message);
        }
    }

    BH.prototype.pjyTuichuFun = function () {
        let res = pjysdk.CardLogout();
        if (res.code == 0) {
            toastLog("退出登陆成功！");
            ui.run(() => {
                ui.endTime.setText("未登陆");
            });
        } else {
            toastLog(res.message);
        }
    }

    BH.prototype.runScript = function () {
        //获取脚本
        home();
        bh.scriptTh = threads.start(function(){

            if (bh.悬浮窗) {
                let window = floaty.window(
                    <frame >
                        <frame id='play'>
                            <img src='@drawable/ic_play_circle_filled_black_48dp' tint='#ffffff'></img>
                            <img src='@drawable/ic_play_circle_outline_black_48dp' tint='#FFC0CB'></img>
                        </frame>
                        <frame id='stop' visibility='gone'>
                            <img src='@drawable/ic_pause_circle_filled_black_48dp' tint='#ffffff'></img>
                            <img src='@drawable/ic_pause_circle_outline_black_48dp' tint='#FFC0CB'></img>
                        </frame>
                    </frame>
                );

                window.setPosition(0, device.height/2);
    
                window.play.on('click', ()=> {
                    log("播放");
                    ui.run( ()=> {
                        window.play.setVisibility(View.INVISIBLE);
                        window.stop.setVisibility(View.VISIBLE);
                        if (bh.runScriptTh == null ||!bh.runScriptTh.isAlive()) {
                            bh.runScriptTh = threads.start(function(){
                                let script = bh.getJgy("script.js").str();

                                eval(script);
                            });
                        } else {
                            toastLog("脚本已经在运行");
                        }
                    });
                });
    
                window.stop.on('click', ()=> {
                    log("暂停");
                    window.play.setVisibility(View.VISIBLE);
                    window.stop.setVisibility(View.INVISIBLE);
                    if (bh.runScriptTh.isAlive()) {
                        bh.runScriptTh.interrupt();
                    } else {
                        toastLog("脚本没有在运行");
                    }
                });

                setInterval(()=>{}, 1000);
            } else {
                if (bh.runScriptTh == null) {
                    bh.runScriptTh = threads.start(function(){
                        let script = bh.getJgy("script.js").str();

                        eval(script);
                    });
                } else {
                    toastLog("脚本已经在运行")
                }
            }
        });
    }

    BH.prototype.starts = function () {
        mainActivity = null;
        mod = null, pjy = null, pjysdk = null;
        
        let th = threads.start(function(){
            mod = bh.require("mod/mod.js");
            if (bh.pjy) {
                pjysdk = new PJYSDK(bh.pjyKey, bh.pjySecret)
        
            }
            mainActivity = bh.getJgy("mainActivity.js").str();
        });while(th.isAlive());eval(mainActivity);
    }

    return BH;
})();

//声明泡椒云SDK
const PJYSDK = (function(){
    function PJYSDK(app_key, app_secret){
        http.__okhttp__.setMaxRetries(0);
        http.__okhttp__.setTimeout(10*1000);

        this.event = events.emitter();

        this.debug = true;
        this._lib_version = "v1.08";
        this._protocol = "https";
        this._host = "api.paojiaoyun.com";
        this._device_id = this.getDeviceID();
        this._retry_count = 9;
        
        this._app_key = app_key;
        this._app_secret = app_secret;
        
        this._card = null;
        this._username = null;
        this._password = null;
        this._token = null;
        
        this.is_trial = false;  // 是否是试用用户
        this.login_result = {
            "card_type": "",
            "expires": "",
            "expires_ts": 0,
            "config": "",
        };

        this._auto_heartbeat = true;  // 是否自动开启心跳任务
        this._heartbeat_gap = 60 * 1000; // 默认60秒
        this._heartbeat_task = null;
        this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};

        this._prev_nonce = null;
    }
    PJYSDK.prototype.SetCard = function(card) {
        this._card = card.trim();
    }
    PJYSDK.prototype.SetUser = function(username, password) {
        this._username = username.trim();
        this._password = password;
    }
    PJYSDK.prototype.getDeviceID = function() {
        let id = device.serial;
        if (id == null || id == "" || id == "unknown") {
            id = device.getAndroidId();
        }
        if (id == null || id == "" || id == "unknown") {
            id = device.getIMEI();
        }
        return id;
    }
    PJYSDK.prototype.MD5 = function(str) {
        try {
            let digest = java.security.MessageDigest.getInstance("md5");
            let result = digest.digest(new java.lang.String(str).getBytes("UTF-8"));
            let buffer = new java.lang.StringBuffer();
            for (let index = 0; index < result.length; index++) {
                let b = result[index];
                let number = b & 0xff;
                let str = java.lang.Integer.toHexString(number);
                if (str.length == 1) {
                    buffer.append("0");
                }
                buffer.append(str);
            }
            return buffer.toString();
        } catch (error) {
            alert(error);
            return "";
        }
    }
    PJYSDK.prototype.getTimestamp = function() {
        try {
            let res = http.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
            let data = res.body.json();
            return Math.floor(data["data"]["t"]/1000);
        } catch (error) {
            return Math.floor(new Date().getTime()/1000);
        }
    }
    PJYSDK.prototype.genNonce = function() {
        const ascii_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let tmp = '';
        for(let i = 0; i < 20; i++) {
            tmp += ascii_str.charAt(Math.round(Math.random()*ascii_str.length));
        }
        return this.MD5(this.getDeviceID() + tmp);
    }
    PJYSDK.prototype.joinParams = function(params) {
        let ps = [];
        for (let k in params) {
            ps.push(k + "=" + params[k])
        }
        ps.sort()
        return ps.join("&")
    }
    PJYSDK.prototype.CheckRespSign = function(resp) {
        if (resp.code != 0 && resp.nonce === "" && resp.sign === "") {
            return resp
        }

        let ps = "";
        if (resp["result"]) {
            ps = this.joinParams(resp["result"]);
        }

        let s = resp["code"] + resp["message"] + ps + resp["nonce"] + this._app_secret;
        let sign = this.MD5(s);
        if (sign === resp["sign"]) {
            if (this._prev_nonce === null) {
                this._prev_nonce = resp["nonce"];
                return {"code":0, "message":"OK"};
            } else {
                if (resp["nonce"] > this._prev_nonce) {
                    this._prev_nonce = resp["nonce"];
                    return {"code": 0, "message": "OK"};
                } else {
                    return {"code": -98, "message": "轻点，疼~"};
                }
            }
        }
        return {"code": -99, "message": "轻点，疼~"};
    }
    PJYSDK.prototype.retry_fib = function(num) {
        if (num > 9) {
            return 34
        }
        let a = 0;
        let b = 1;
        for (i = 0; i < num; i++) {
            let tmp = a + b;
            a = b
            b = tmp
        }
        return a
    }
    PJYSDK.prototype._debug = function(path, params, result) {
        if (this.debug) {
            log("\n" + path, "\nparams:", params, "\nresult:", result);
        }
    }
    PJYSDK.prototype.Request = function(method, path, params) {
        // 构建公共参数
        params["app_key"] = this._app_key;

        method = method.toUpperCase();
        let url = this._protocol + "://" + this._host + path
        let max_retries = this._retry_count;
        let retries_count = 0;

        let data = {"code": -1, "message": "连接服务器失败"};
        do {
            retries_count++;
            let sec = this.retry_fib(retries_count);

            delete params["sign"]
            params["nonce"] = this.genNonce();
            params["timestamp"] = this.getTimestamp();
            let ps = this.joinParams(params);
            let s = method + this._host + path + ps + this._app_secret;
            let sign = this.MD5(s);
            params["sign"] = sign;

            let resp, body;
            try {    
                if (method === "GET") {
                    resp = http.get(url + "?" + ps + "&sign=" + sign);
                } else {  // POST
                    resp = http.post(url, params);
                }
                body = resp.body.string();
                data = JSON.parse(body);
                this._debug(method+'-'+path+':', params, data);
                
                let crs = this.CheckRespSign(data);
                if (crs.code !== 0) {
                    return crs;
                } else {
                    return data;
                }
            } catch (error) {
                log("[*] request error: ", error, sec + "s后重试");
                this._debug(method+'-'+path+':', params, body)
                sleep(sec*1000);
            }
        } while (retries_count < max_retries);

        return data;
    }
    /* 通用 */
    PJYSDK.prototype.GetHeartbeatResult = function() {
        return this._heartbeat_ret;
    }
    PJYSDK.prototype.GetTimeRemaining = function() {
        let g = this.login_result.expires_ts - this.getTimestamp();
        if (g < 0) {
            return 0;
        } 
        return g;
    }
    /* 卡密相关 */
    PJYSDK.prototype.CardLogin = function() {  // 卡密登录
        if (!this._card) {
            return {"code": -4, "message": "请先设置卡密"};
        }
        let method = "POST";
        let path = "/v1/card/login";
        let data = {"card": this._card, "device_id": this._device_id};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this._token = ret.result.token;
            this.login_result = ret.result;
            if (this._auto_heartbeat) {
                this._startCardHeartheat();
            }
        }
        return ret;
    }
    PJYSDK.prototype.CardHeartbeat = function() {  // 卡密心跳，默认会自动调用
        if (!this._token) {
            return {"code": -2, "message": "请在卡密登录成功后调用"};
        }
        let method = "POST";
        let path = "/v1/card/heartbeat";
        let data = {"card": this._card, "token": this._token};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this.login_result.expires = ret.result.expires;
            this.login_result.expires_ts = ret.result.expires_ts;
        }
        return ret;
    }
    PJYSDK.prototype._startCardHeartheat = function() {  // 开启卡密心跳任务
        if (this._heartbeat_task) {
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        this._heartbeat_task = threads.start(function(){
            setInterval(function(){}, 10000);
        });
        this._heartbeat_ret = this.CardHeartbeat();
        
        this._heartbeat_task.setInterval((self) => {
            self._heartbeat_ret = self.CardHeartbeat();
            if (self._heartbeat_ret.code != 0) {
                self.event.emit("heartbeat_failed", self._heartbeat_ret);
            }
        }, this._heartbeat_gap, this);

        this._heartbeat_task.setInterval((self) => {
            if (self.GetTimeRemaining() == 0) {
                self.event.emit("heartbeat_failed", {"code": 10210, "message": "卡密已过期！"});
            }
        }, 1000, this);
    }
    PJYSDK.prototype.CardLogout = function() {  // 卡密退出登录
        this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
        if (this._heartbeat_task) { // 结束心跳任务
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        if (!this._token) {
            return {"code": 0, "message": "OK"};
        }
        let method = "POST";
        let path = "/v1/card/logout";
        let data = {"card": this._card, "token": this._token};
        let ret = this.Request(method, path, data);
        // 清理
        this._token = null;
        this.login_result = {
            "card_type": "",
            "expires": "",
            "expires_ts": 0,
            "config": "",
        };
        return ret;
    }
    PJYSDK.prototype.CardUnbindDevice = function() { // 卡密解绑设备，需开发者后台配置
        if (!this._token) {
            return {"code": -2, "message": "请在卡密登录成功后调用"};
        }
        let method = "POST";
        let path = "/v1/card/unbind_device";
        let data = {"card": this._card, "device_id": this._device_id, "token": this._token};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.SetCardUnbindPassword = function(password) { // 自定义设置解绑密码
        if (!this._token) {
            return {"code": -2, "message": "请在卡密登录成功后调用"};
        }
        let method = "POST";
        let path = "/v1/card/unbind_password";
        let data = {"card": this._card, "password": password, "token": this._token};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.CardUnbindDeviceByPassword = function(password) { // 用户通过解绑密码解绑设备
        let method = "POST";
        let path = "/v1/card/unbind_device/by_password";
        let data = {"card": this._card, "password": password};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.CardRecharge = function(card, use_card) { // 以卡充卡
        let method = "POST";
        let path = "/v1/card/recharge";
        let data = {"card": card, "use_card": use_card};
        return this.Request(method, path, data);
    }
    /* 用户相关 */
    PJYSDK.prototype.UserRegister = function(username, password, card) {  // 用户注册（通过卡密）
        let method = "POST";
        let path = "/v1/user/register";
        let data = {"username": username, "password": password, "card": card, "device_id": this._device_id};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UserLogin = function() {  // 用户账号登录
        if (!this._username || !this._password) {
            return {"code": -4, "message": "请先设置用户账号密码"};
        }
        let method = "POST";
        let path = "/v1/user/login";
        let data = {"username": this._username, "password": this._password, "device_id": this._device_id};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this._token = ret.result.token;
            this.login_result = ret.result;
            if (this._auto_heartbeat) {
                this._startUserHeartheat();
            }
        }
        return ret;
    }
    PJYSDK.prototype.UserHeartbeat = function() {  // 用户心跳，默认会自动开启
        if (!this._token) {
            return {"code": -2, "message": "请在用户登录成功后调用"};
        }
        let method = "POST";
        let path = "/v1/user/heartbeat";
        let data = {"username": this._username, "token": this._token};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this.login_result.expires = ret.result.expires;
            this.login_result.expires_ts = ret.result.expires_ts;
        }
        return ret;
    }
    PJYSDK.prototype._startUserHeartheat = function() {  // 开启用户心跳任务
        if (this._heartbeat_task) {
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        this._heartbeat_task = threads.start(function(){
            setInterval(function(){}, 10000);
        });
        this._heartbeat_ret = this.UserHeartbeat();

        this._heartbeat_task.setInterval((self) => {
            self._heartbeat_ret = self.UserHeartbeat();
            if (self._heartbeat_ret.code != 0) {
                self.event.emit("heartbeat_failed", self._heartbeat_ret);
            }
        }, this._heartbeat_gap, this);

        this._heartbeat_task.setInterval((self) => {
            if (self.GetTimeRemaining() == 0) {
                self.event.emit("heartbeat_failed", {"code": 10250, "message": "用户已到期！"});
            }
        }, 1000, this);
    }
    PJYSDK.prototype.UserLogout = function() {  // 用户退出登录
        this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
        if (this._heartbeat_task) { // 结束心跳任务
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        if (!this._token) {
            return {"code": 0, "message": "OK"};
        }
        let method = "POST";
        let path = "/v1/user/logout";
        let data = {"username": this._username, "token": this._token};
        let ret = this.Request(method, path, data);
        // 清理
        this._token = null;
        this.login_result = {
            "card_type": "",
            "expires": "",
            "expires_ts": 0,
            "config": "",
        };
        return ret;
    }
    PJYSDK.prototype.UserChangePassword = function(username, password, new_password) {  // 用户修改密码
        let method = "POST";
        let path = "/v1/user/password";
        let data = {"username": username, "password": password, "new_password": new_password};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UserRecharge = function(username, card) { // 用户通过卡密充值
        let method = "POST";
        let path = "/v1/user/recharge";
        let data = {"username": username, "card": card};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UserUnbindDevice = function() { // 用户解绑设备，需开发者后台配置
        if (!this._token) {
            return {"code": -2, "message": "请在用户登录成功后调用"};
        }
        let method = "POST";
        let path = "/v1/user/unbind_device";
        let data = {"username": this._username, "device_id": this._device_id, "token": this._token};
        return this.Request(method, path, data);
    }
    /* 配置相关 */
    PJYSDK.prototype.GetCardConfig = function() { // 获取卡密配置
        let method = "GET";
        let path = "/v1/card/config";
        let data = {"card": this._card};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UpdateCardConfig = function(config) { // 更新卡密配置
        let method = "POST";
        let path = "/v1/card/config";
        let data = {"card": this._card, "config": config};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.GetUserConfig = function() { // 获取用户配置
        let method = "GET";
        let path = "/v1/user/config";
        let data = {"user": this._username};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UpdateUserConfig = function(config) { // 更新用户配置
        let method = "POST";
        let path = "/v1/user/config";
        let data = {"username": this._username, "config": config};
        return this.Request(method, path, data);
    }
    /* 软件相关 */
    PJYSDK.prototype.GetSoftwareConfig = function() { // 获取软件配置
        let method = "GET";
        let path = "/v1/software/config";
        return this.Request(method, path, {});
    }
    PJYSDK.prototype.GetSoftwareNotice = function() { // 获取软件通知
        let method = "GET";
        let path = "/v1/software/notice";
        return this.Request(method, path, {});
    }
    PJYSDK.prototype.GetSoftwareLatestVersion = function(current_ver) { // 获取软件最新版本
        let method = "GET";
        let path = "/v1/software/latest_ver";
        let data = {"version": current_ver};
        return this.Request(method, path, data);
    }
    /* 试用功能 */
    PJYSDK.prototype.TrialLogin = function() {  // 试用登录
        let method = "POST";
        let path = "/v1/trial/login";
        let data = {"device_id": this._device_id};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this.is_trial = true;
            this.login_result = ret.result;
            if (this._auto_heartbeat) {
                this._startTrialHeartheat();
            }
        }
        return ret;
    }
    PJYSDK.prototype.TrialHeartbeat = function() {  // 试用心跳，默认会自动调用
        let method = "POST";
        let path = "/v1/trial/heartbeat";
        let data = {"device_id": this._device_id};
        let ret = this.Request(method, path, data);
        if (ret.code == 0) {
            this.login_result.expires = ret.result.expires;
            this.login_result.expires_ts = ret.result.expires_ts;
        }
        return ret;
    }
    PJYSDK.prototype._startTrialHeartheat = function() {  // 开启试用心跳任务
        if (this._heartbeat_task) {
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        this._heartbeat_task = threads.start(function(){
            setInterval(function(){}, 10000);
        });
        this._heartbeat_ret = this.TrialHeartbeat();

        this._heartbeat_task.setInterval((self) => {
            self._heartbeat_ret = self.TrialHeartbeat();
            if (self._heartbeat_ret.code != 0) {
                self.event.emit("heartbeat_failed", self._heartbeat_ret);
            }
        }, this._heartbeat_gap, this);

        this._heartbeat_task.setInterval((self) => {
            if (self.GetTimeRemaining() == 0) {
                self.event.emit("heartbeat_failed", {"code": 10407, "message": "试用已到期！"});
            }
        }, 1000, this);
    }
    PJYSDK.prototype.TrialLogout = function() {  // 试用退出登录，没有http请求，只是清理本地记录
        this.is_trial = false;
        this._heartbeat_ret = {"code": -9, "message": "还未开始验证"};
        if (this._heartbeat_task) { // 结束心跳任务
            this._heartbeat_task.interrupt();
            this._heartbeat_task = null;
        }
        // 清理
        this._token = null;
        this.login_result = {
            "card_type": "",
            "expires": "",
            "expires_ts": 0,
            "config": "",
        };
        return {"code": 0, "message": "OK"};;
    }
    /* 高级功能 */
    PJYSDK.prototype.GetRemoteVar = function(key) { // 获取远程变量
        let method = "GET";
        let path = "/v1/af/remote_var";
        let data = {"key": key};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.GetRemoteData = function(key) { // 获取远程数据
        let method = "GET";
        let path = "/v1/af/remote_data";
        let data = {"key": key};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.CreateRemoteData = function(key, value) { // 创建远程数据
        let method = "POST";
        let path = "/v1/af/remote_data";
        let data = {"action": "create", "key": key, "value": value};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.UpdateRemoteData = function(key, value) { // 修改远程数据
        let method = "POST";
        let path = "/v1/af/remote_data";
        let data = {"action": "update", "key": key, "value": value};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.DeleteRemoteData = function(key, value) { // 删除远程数据
        let method = "POST";
        let path = "/v1/af/remote_data";
        let data = {"action": "delete", "key": key};
        return this.Request(method, path, data);
    }
    PJYSDK.prototype.CallRemoteFunc = function(func_name, params) { // 执行远程函数
        let method = "POST";
        let path = "/v1/af/call_remote_func";
        let ps = JSON.stringify(params);
        let data = {"func_name": func_name, "params": ps};
        let ret = this.Request(method, path, data);
        if (ret.code == 0 && ret.result.return) {
            ret.result = JSON.parse(ret.result.return);
        }
        return ret;
    }
    return PJYSDK;
})();


bh = new BH("17685034710@163.com", "ah94esu8ymqvir9m", "BanHua3/", "c0bosdso6itd9d2u21h0", "LjdrmQy1VRTUp86Ubmr2RUslAHji9I2s");

bh.starts();