class DialogueSystem{
    constructor(first_orderbox, widgets){
        { 
            this.user_answer = 2;
            
            this.answer_correct = widgets[0]; //0:answer_correct
            this.answer_wrong = widgets[1];//1:answer_wrong
            this.answer_explain = widgets[2];//2answer_explain
            this.speech_question = widgets[3]; //3:speech_question
            this.speech_answer = widgets[4]; //4:speech_answer

            this.btn1 = widgets[5][0]; //5_0:btn1　☚imgオブジェクトです
            this.btn2 = widgets[5][1]; //5_1:btn2　☟
            this.btn3 = widgets[5][2]; //5_2:btn3
            this.btn4 = widgets[5][3]; //5_3:btn4
            this.middle_btn = widgets[5][4]; //5_4:middle_btn

            this.number_of_question = widgets[6];//6:第N問の文字
            this.num_of_current_que = 1;//現在の問題数　Nを保存する

            this.question_items = document.getElementsByClassName("question");
            this.answer_items = document.getElementsByClassName("answer");
            this.question_of_pic = document.getElementById("question_of_pic");

            this.correct_number = 0;
            this.amount_of_question = 0;
           
        }
        {
            this.dialogue_set =[]; //会話内容　リスト型

            this.dialogue_index = 0; //dialogue_set（会話内容リスト）のindex番号
            this.order_index = 0;
            this.orders = [];//list型。index番号で、行いたい動作(order)を取り出す。
                                                   
            this.dialogue_changed_flg = 0; //会話が変わったかを示す。０は変わってない。１は変わったことを示す。
            this.order_changed_flg = 0;
    
            /*以下　各関数ごとの内部インデックス番号。主に、btnを２つ使う関数におけるaddEventLitenerの有効判断に使います*/
            this.func_CHANGE_DS_INDEX_index = 0;
            this.func_CHANGE_DS_PACK_index = 0;
    
            this.do_consoleflg = 1;
            this.innerfunc_consoleflg = 1;
        }
        

        //######DialogueSystemを起動した際にはログインしているか判定########
        if(this.do_consoleflg){
            console.log(`__INIT__ %c【ARE_THERE_DATA】`,`color:green`);
        };

        this.first_orderbox = first_orderbox;
        this.are_there_data();
    }

    do(){ 
        //classの基本メソッド。doを作動させて　classを使います。
        
        {//do関数の説明
        /* Dialogue Systemの概要
            1.dictionary_set
            dictionary_setはlist型です。インデックス番号で会話を取り出します。

            2.orders
            ordersはlist型です。インデックス番号で[命令,引数1,(引数2,引数3・・・)]
            をorderに格納します。

            orderからは、order_argに第一引数を（第二引数移行は、各関数で必要に応じて取り出す）
            commandに命令を格納します。
        */
        }
        /*console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>%cvariables are below`,`color:red`);
        var variables = [
            ["USER_NAME",this.user_name],
            ["BIRTH_DAY",this.birth_day ]
        ]
        console.table(variables);
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>%cthat is all`,`color:red`);
        */

        this.order = this.orders[this.order_index];
        //命令書を取り出す
        try{    
            this.order_arg = this.order[1]; //引数を保存
        }catch(error){
            alert("[]と[]の間にコンマ忘れています！！！")
        }
            this.command = this.order[0];//命令を格納
        
        
        //if条件　命令種別を分析
        if(this.command == "next"){
            if(this.do_consoleflg){
                console.log(`in%c【NEXT】`,`color:green`);
            };
            this.next_dialogue();
        }else if(this.command == "to_dialogue"){
            if(this.do_consoleflg){
                console.log(`in%c【TO_DIALOGUE】`,`color:green`);
            };
            this.to_dialogue();
        }else if(this.command == "to_order"){
            if(this.do_consoleflg){
                console.log(`in%c【TO_ORDER】`,`color:green`);
            };
            this.to_order();
        }else if(this.command == "check_<change_d&s_index>"){
            if(this.do_consoleflg){
                console.log(`in%c【CHECK_CHANGE_DS_INDEX】`,`color:green`);
            };
            this.check_change_ds_index();
        }else if(this.command == "change_d&s_pack"){
            if(this.do_consoleflg){
                console.log(`in%c【CHANGE_DS_PACK】`,`color:green`);
            };
            this.change_ds_pack();
        }else if(this.command == "link"){
            if(this.do_consoleflg){
                console.log(`in%c【LINK】`,`color:green`);
            };
            this.link();
        }else if(this.command == "load"){
            if(this.do_consoleflg){
                console.log(`in%c【LOAD_DIALOGUE_4START】`,`color:green`);
            };
            this.load_dialogue_4start();
        }else if(this.command == "next_question"){
            if(this.do_consoleflg){
                console.log(`in%c【NEXT_QUESTION】`,`color:green`);
            };
            this.next_question();
        }else if(this.command == "answer"){
            if(this.do_consoleflg){
                console.log(`in%c【ANSWER】`,`color:green`);
            };
            this.answer();
        }else if(this.command == "end"){
            if(this.do_consoleflg){
                console.log(`in%c【END】`,`color:green`);
            };
            this.end();
        }
        else{
            alert("it is out of command. orderboxの書き方に異常があります。");
        }// end of if
       

        this.show_log_4debug();//デバッグ用のconsole.log表示

    }

    show_log_4debug(){//console.logに表示させるための機能

        
        //############パックのテーブル表示#################
        var do_you_wanna_see_table = 1;//ここで調節。１なら表示。０なら非表示

        if(do_you_wanna_see_table==1){
            this.dialogue_set4log = this.dialogue_set;
            this.orders_list4log = this.orders;
        }
        //###############################################

        var font_dict = new Map();
        font_dict.set(0,`color:black;font-weight:normal`);//非太字、黒色にする記述
        font_dict.set(1,`color:red;font-weight:bold`);//太字、赤色にする記述

        /** ===========  会話についてのログ製作 ===============**/
        if(this.dialogue_changed_flg==1 || this.dialogue_changed_flg==2){//flg 1=会話変更、 2=命令実行後に会話変更予定、 0=会話変更なし
            if(this.dialogue_set[this.dialogue_index]===undefined){//undefinedは次の会話ログが無い場合に取得されます
                var message = ` 会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。 会話もフキダシの文に更新されました。 %c現在、表示されている会話が最後の会話文です%c%c%c。 `     
                var dialogue_logfont_pattern = [1,0,1,0,0,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
            }else{
                if(this.command == "check_<change_d&s_index>"){//確認する（任意の場所へ移動）は表示する会話が二通りあるので　別処理
                    var raw_dialogueindex = this.orders[this.order_index][1];//会話インデックス番号
                  
                    var dialogue_of_yes = this.dialogue_set[this.dialogue_index];
                    var dialogue_of_no = this.dialogue_set[raw_dialogueindex];
                    var message = `会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。会話もフキダシの文に更新されました。次は　はいの場合 %c${dialogue_of_yes}%cを。いいえの場合、%c${dialogue_of_no}%cをフキダシに表示されます。`
                }else{//通常の処理
                    var message = `会話インデックス番号は「%c${this.dialogue_index}%c」に変わりました。会話もフキダシの文に更新されました。次は %c${this.dialogue_set[this.dialogue_index]}%cをフキダシに表示されます。%c%c`
                }
                    var dialogue_logfont_pattern = [1,0,1,0,1,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
            }
            
        }else{//会話ログが次ない場合
            var message = `今回、%c%c%c会話文は変更されてません%c%c%c。`
            var dialogue_logfont_pattern = [0,0,1,0,0,0];//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }

        if(this.order_changed_flg==1){//flg=1は　命令完了
            try{
                var order_messasge = `「%c${this.command}%c」を実行しました。命令インデックス番号は「%c${this.order_index}%c」に変わりました。次は「%c${this.orders[this.order_index][[0]]}%c」を実行します。%c%c`
            }catch(error){
                var order_messasge = `「%c${this.command}%c」を実行しました。%cこれが最後の命令です%c%c%c%c%c`
            }
            var order_logfont_pattern = [1,0,1,0,1,0,0,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }else if(this.order_changed_flg==2){//flg=2はボタン入力待ち等　実行待ち
            if(this.command == "check_<change_d&s_index>"){//確認する（任意の場所へ移動）は命令が二つ設定されているため別処理。
                var raw_orderindex = this.orders[this.order_index][1];//命令
                var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次ははいの場合「%c${this.orders[this.order_index+1][[0]]}%c」、いいえの場合「%cto_関数を実行後、${this.orders[raw_orderindex][0]}%c」を実行します。`
            }else{//通常処理
                try{//次の命令がある場合の処理
                    var order_messasge = `「%c${this.command}%c」の実行待機中です。命令インデックス番号は実行後「%c${this.order_index+1}%c」に変わります。次は「%c${this.orders[this.order_index+1][[0]]}%c」を実行します。%c%c`
                }catch(error){//次の命令がない場合、undefinedを読み込みエラーとなる。
                    var order_messasge = `「%c${this.command}%c」の実行待機中です。%cこれがこの命令パック最後の命令です%c%c%c%c%c。`
                }
            }
            
            var order_logfont_pattern = [1,0,1,0,1,0,1,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }
        else{//命令が無かった場合
            var order_messasge = `「%c%c%c%c%c命令インデックス番号に変化はありません%c%c%c。`
            var order_logfont_pattern = [0,0,0,0,1,0,0,0]//%cの設定を１（赤太字）、0（黒通常太さ)で行う。そのためのdictionary型
        }

        console.log(`%c【do実行後】%c;
        【%c命令%c: ${order_messasge}】
        【%c会話%c: ${message}】`,
                            `font-weight:bold;`,`font-weight:normal;`,
            `font-weight:bold;`,`font-weight:normal;`,font_dict.get(order_logfont_pattern[0]),font_dict.get(order_logfont_pattern[1]),font_dict.get(order_logfont_pattern[2]),font_dict.get(order_logfont_pattern[3]),font_dict.get(order_logfont_pattern[4]),font_dict.get(order_logfont_pattern[5]),font_dict.get(order_logfont_pattern[6]),font_dict.get(order_logfont_pattern[7]),
            `font-weight:bold;`,`font-weight:normal;`,font_dict.get(dialogue_logfont_pattern[0]),font_dict.get(dialogue_logfont_pattern[1]),font_dict.get(dialogue_logfont_pattern[2]),font_dict.get(dialogue_logfont_pattern[3]),font_dict.get(dialogue_logfont_pattern[4]),font_dict.get(dialogue_logfont_pattern[5]),
        );

        if(do_you_wanna_see_table){
            console.table(this.orders_list4log);
            console.table(this.dialogue_set4log);
        }
        this.dialogue_changed_flg = 0;//会話が切り替わった指標を初期化する
        this.order_changed_flg = 0;//命令が実行された指標を初期化する
    }

    are_there_data(){//cookieを参照し、ログイン済みかを判定する データ取得するものはここに書く
        //this.order_arg = 未ログインの場合の命令ボックス
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<ARE_THERE_DATA>>`,`color:blue`);
        };
        
  

        var value = `; ${document.cookie}`;
        var parts = value.split(`; logined_data=`);
        try{
            var data_list = JSON.parse(decodeURIComponent(parts.pop().split(";").shift()));
        }catch(error){
            var data_list = [];
        }
        /*
        console.log(`%c==============================here is cookie data `,`color:purple`);
        console.table(data_list);
        console.log(`%c＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝That's all `,`color:purple`);
        */

        if(data_list.length> 1){
            /*
            this.user_name =data_list[0]         // 0:ユーザー名
            this.birth_day =data_list[1]         // 1:ユーザーの誕生日
            this.booked_fortuneteller = data_list[2] // 2:予約した占い師
            //ここでもうデータを取り出してしまう
            */
   
        }

        for (var i = 0; i < this.question_items.length; i++) {
            this.question_items[i].style.visibility = "hidden";
        }
        //画面切り替え

        this.dialogue_set = this.first_orderbox[0];
        this.orders = this.first_orderbox[1];

        this.order_index = 0;
        this.dialogue_index = 0;
        this.do();

    }

    load_dialogue_4start(){
   
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LOAD_DIALOGUE_4START>>`,`color:blue`);
        };

        this.answer_explain.style.visibility = "visible";
        this.answer_correct.style.visibility = "hidden";
        this.answer_wrong.style.visibility = "hidden";
        //答えセット　タイトル画像を【説明用】に変える

        //会話パックの最初のログを読み込むための関数。
        this.load_dialogue();
        //ログを読み込む

        this.middle_btn.textContent = "次へ";
    
        //ここが開始時のみの記述
        //ボタンの表示設定

        this.middle_btn.addEventListener("click",()=>{
            this.do();
        },{once:true});
        //ボタン１にイベント設定。


        this.dialogue_index += 1;
        //会話インデックスを更新分、１つ増加
        this.order_index += 1;
        this.order_changed_flg = 1;
        //命令を終えたため、命令インデックスを一つ増加


    }

    load_dialogue(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LOAD_DIALOGUE>>`,`color:blue`);
        };
        //引数はなし

        

        this.contents_of_speech = this.dialogue_set[this.dialogue_index];
        //dialogue_indexは会話パックのインデックス番号である。
        //会話パックdialogue_setから、インデックス番号を使って会話を取り出す

        this.translate_command();//#command#の分析・読み取り・置換        
       
        this.speech_answer.innerHTML = this.contents_of_speech;
        
        this.dialogue_changed_flg = 1;//会話を変えたことを記録

    }

    translate_command(){//this.contents_of_speechに文字列を入れる。その後実行、return:this.contents_of_speech
        //<command>分析・読み取り・置換

        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TRANSLATE_COMMAND>>`,`color:blue`);
        };

        var regex = /#([^#]+)#/g;
        var match;
        var string_command_list = [];
        while ((match = regex.exec(this.contents_of_speech)) !== null) {
            string_command_list.push(match);
        }

        string_command_list.forEach(command =>{//コマンド式テンプレートリテラル法
            
            switch(command[1]){//ここに、処理するコマンドを書く
                case "command_correct_number":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_correct_number#",this.correct_number);
                case "command_amount_of_question":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_amount_of_question#",this.amount_of_question);
            }
        });        
    }

    next_dialogue(){
        //引数はなし
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<NEXT_DIALOGUE>>`,`color:blue`);
        };
       
        var next_order =this.orders[this.order_index][0];
        
        this.middle_btn.innerHTML = "次へ"; 
        //ボタンの表示設定

        if(next_order == "check_ds_index" || next_order == "check_ds_pack"){           
            this.do();

            //次の命令がcheckの場合は、ボタンセットを表示させるcheck命令を実行させる
        }else{
            
            this.middle_btn.addEventListener("click", () =>{
                this.do();                
            }, { once: true });
            //speechへのイベント設定は next_order="check"の時はしません。
            //してしまうと、speechのイベントが二重になります。
            //そしてシステムの一大バグ「なぜか会話が一つ飛び」(格闘4時間）を引き起こしてしまいます。
        }
       
        
        this.load_dialogue();
        //会話文を更新     

        this.dialogue_index += 1;
        //会話パックのインデックス番号を増加
       
        
        this.order_index += 1;
        this.order_changed_flg = 1;
        //命令を一つ終えたため、命令インデックスを１つ増加
    }

    to_dialogue(){//【to_関数　手順➀】
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TO_DIALOGUE>>`,`color:blue`);
        };
        var second_order_arg = this.order[2];
    
        //任意の会話インデックス値を取得

        this.dialogue_index = second_order_arg;
        //任意の会話になるように、会話インデックス番号を変更
        //必ずto_order()命令インデックス指定関数も一緒に実行してください。
     
        this.load_dialogue();
 
    }

    to_order(){//【to_関数　手順➁】     
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<TO_ORDER>>`,`color:blue`);
        };
        this.order_index = parseInt(this.order_arg);
        this.order_changed_flg = 1;
        //任意の命令になるように、命令インデックス番号を変更
        this.do();
        //更新された命令インデックス番号によって、命令を更新
    } 

    check_change_ds_index(){//checkの分岐によって、会話パックのインデックス番号を変える命令です
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<CHECK_CHANGE_DS_INDEX>>`,`color:blue`);
        };
        //arg1:to_order用　　arg2:to_dialogue用

        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = "はい"
        this.btn2.textContent = "いいえ"
        //ボタンの表示設定
        //btn等の設定

        this.contents_of_speech = this.order[3];
        this.translate_command();
        
        this.speech.innerHTML = this.contents_of_speech;//表示する文
        
       var now_functions_index = this.func_CHANGE_DS_INDEX_index + 1;
        this.btn1.addEventListener("click", ()=> {
         
            if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない

                this.order_index += 1;
                this.do();
            }
            //【はい】を押した場合のイベント
        },{once:true});     

        this.btn2.addEventListener("click", ()=> {
            if(this.order[0]=="check_<change_d&s_index>"&& now_functions_index == this.func_CHANGE_DS_INDEX_index){
                this.btn1.textContent = "次へ"
                this.btn2.textContent = "ー"

                //checkは２つのボタンにイベントをつける。
                //一方のイベントで、命令が進んだら　押されなかったボタンを無効にする
                //すなわち、this.order[0] == "next"になってたら以下のイベントを実行しない
                this.to_dialogue();
                //任意の会話に設定して、ロード
                this.to_order();
                //任意の命令に設定して、実行
            }
            //【いいえ】を押した時のイベント
        },{once:true});   
        
        this.dialogue_changed_flg =2;
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に


        this.func_CHANGE_DS_INDEX_index += 1; //関数内インデックスを増加
    }

    change_ds_pack(){//ボタンの分岐によって、会話・命令パックを切り替える命令ですa
        //this.order_arg = btn1の時のパック
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<CHANGE_DS_PACK>>`,`color:blue`);
        };
        var second_order_arg = this.order[2];//btn1のボタン表示
        var third_order_arg = this.order[3];//btn2の時のパック
        var fourth_order_arg = this.order[4];//btn2のボタン表示
        var fifth_order_arg = this.order[5];//分岐時に表示する文

        this.entry.placeholder = ""
        this.entry.value = ""
        //直前のentryに表示されているものを初期化。checkでは使いません
        this.btn1.textContent = second_order_arg;
        this.btn2.textContent = fourth_order_arg;
        //ボタンの表示設定
        //btn等の設定

        this.contents_of_speech =  fifth_order_arg;
        this.translate_command();//#command#がある場合に、処理を行う。
        this.speech.innerHTML = this.contents_of_speech;//分岐時の文を表示する
                                    
        
        var now_functions_index = this.func_CHANGE_DS_PACK_index + 1;
        //+1をするのは、関数実行後にthis.func_CHANGE**が１つ増加するため。

        //alert("changedspack")
        this.btn1.addEventListener("click", ()=>{
  
            if(this.order[0]=="change_d&s_pack"&& now_functions_index == this.func_CHANGE_DS_PACK_index){
            this.dialogue_index = 0;
            this.order_index = 0;
            //console.log(`？＋？＋it is next. order_index is ${this.order_index}. dialogue is ${this.dialogue_set[this.dialogue_index]}`)
            //命令ボックスを移行するため、すべてのインデックス番号を初期化
            this.dialogue_set = this.order_arg[0];
            this.orders  = this.order_arg[1];
                
            //新しい命令ボックスから、それぞれ会話パック、命令パックを取り出し、更新。
            
            this.do();
            //画面を更新
        }
        },{once:true});

        this.btn2.addEventListener("click", ()=>{
  
            if(this.order[0]=="change_d&s_pack"&& now_functions_index == this.func_CHANGE_DS_PACK_index){
                this.dialogue_index = 0;
                this.order_index = 0;
                //命令ボックスを移行するため、すべてのインデックス番号を初期化
                this.dialogue_set = third_order_arg[0];
                this.orders  = third_order_arg[1];
               //新しい命令ボックスから、それぞれ会話パック、命令パックを取り出し、更新。
                this.do();
                //画面を更新
            }
        },{once:true});
        
        this.order_changed_flg = 2;//ボタン押してもらうので、待機中判定に
        
        this.func_CHANGE_DS_PACK_index += 1; //関数内インデックスを増加
    }

    link(){//≪データ記入場≫
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<LINK>>`,`color:blue`);
        };

        var user_data = [
            this.user_name,             // 0:ユーザー名
            this.birth_day,             // 1:ユーザーの誕生日
            this.booked_fortuneteller   //  2:予約した占い師名
        ]

        const expires = new Date();
        expires.setTime(expires.getTime() + 2000);//2000
        document.cookie = `logined_data = ${encodeURIComponent(JSON.stringify(user_data))};path=/; expires=${expires.toUTCString()}`;

        window.location.href = this.order_arg;
        this.order_changed_flg = 1;
        //引数にあるhtmlリンクを表示させる
    }
    
    next_question(){

        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<NEXT_QUESTION>>`,`color:blue`);
        };

        //["next_question", 問題文,[btn1の内容,TF_ind], [btn2の内容,TF_ind], [btn3の内容,TF_ind],[btn4の内容, TF_ind]]
        //(TF_indには0:False, 1:Trueを入れて下さい。2を入れるとbtnイベントを無効化します)
        for (var i = 0; i < this.question_items.length; i++) {
            this.question_items[i].style.visibility = "visible";
        }
        for (var i = 0; i < this.answer_items.length; i++) {
            this.answer_items[i].style.visibility = "hidden";
        }
        //画面切り替え

        //this.order_arg = 問題文
        var second_order_arg = this.order[2]; 
        var third_order_arg = this.order[3];
        var fourth_order_arg = this.order[4];
        var fifth_order_arg = this.order[5];
        var six_order_arg = this.order[6];

        var btn1_content = second_order_arg[0]; //btn1の内容
        var btn1_tf = second_order_arg[1];//btn1の正誤

        var btn2_content =  third_order_arg[0]; //btn2の内容
        var btn2_tf = third_order_arg[1];//btn2の正誤

        this.question_of_pic.src = six_order_arg;
        
        try{
            var btn3_content =  fourth_order_arg[0]; //btn3の内容
            var btn3_tf = fourth_order_arg[1];//btn3の正誤

            var btn4_content =  fifth_order_arg[0]; //btn4の内容
            var btn4_tf = fifth_order_arg[1];//btn4の正誤
        }catch(error){
            alert("使わないボタンに[^^^^,2]やってないよ！！ ");
        }

        var btn_contents = [btn1_content,btn2_content,btn3_content,btn4_content];
        console.table(btn_contents);
        var i = 0;
        for(let item of btn_contents){
            let strlength = item.length;
            let num_of_br = 0;
            try{
                num_of_br = item.match(/<br>/g).length;
                num_of_br = num_of_br ? num_of_br:0; // 3項演算　【条件式 ? TRUE : FALSE;】(matchしなかった場合に備える)
            }catch(error){
                num_of_br = 0;
            }
            let newlines = Math.floor(strlength/8) + num_of_br;

            console.log(newlines);
            switch(newlines){
                case 0:
                    btn_contents[i] = "<br>" + btn_contents[i];
                    break;
                case 1:
                    btn_contents[i] = "<br>" + btn_contents[i];
                    break;
                
            }

            i += 1;
        };
        

        this.btn1.innerHTML = btn_contents[0];
        this.btn2.innerHTML = btn_contents[1];
        this.btn3.innerHTML = btn_contents[2];
        this.btn4.innerHTML = btn_contents[3];
        this.speech_question.innerHTML = this.order_arg;
        this.number_of_question.innerHTML = `第${this.num_of_current_que}問`;
        //文字の表示

        var flg_trigger = this.num_of_current_que+1;//現在の問題でなければ、btnイベントを無効化する。
        if(btn1_tf < 2){
            this.btn1.addEventListener("click",()=>{
                if(this.num_of_current_que == flg_trigger){
                    this.user_answer = btn1_tf;
                    this.do();
                }
            },{once:true});
        }
        
        if(btn2_tf < 2){
            this.btn2.addEventListener("click",()=>{

                if(this.num_of_current_que == flg_trigger){
                    this.user_answer = btn2_tf;
                    this.do();
                }
            },{once:true});
        }

        if(btn3_tf < 2){
            this.btn3.addEventListener("click",()=>{
    
                if(this.num_of_current_que == flg_trigger){
                    this.user_answer = btn3_tf;
                    this.do();
                }
            },{once:true});
        }

        if(btn4_tf < 2){
            this.btn4.addEventListener("click",()=>{
                if(this.num_of_current_que == flg_trigger){
                    this.user_answer = btn4_tf;
                    this.do();
                }
            },{once:true});
        }

        for (var i = 0; i < this.question_items.length; i++) {
            this.question_items[i].style.visibility = "visible";
        }
        for (var i = 0; i < this.answer_items.length; i++) {
            this.answer_items[i].style.visibility = "hidden";
        }
        //画面切り替え
    
        this.amount_of_question += 1;

        this.num_of_current_que += 1;
        
        this.order_index += 1;
        this.order_changed_flg = 2;
        //命令を一つ終えたため、命令インデックスを１つ増加

    }

    answer(){

        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<ANSWER>>`,`color:blue`);
        };
        // ["answer",解説文]
        for (var i = 0; i < this.question_items.length; i++) {
            this.question_items[i].style.visibility = "hidden";
        }
        for (var i = 0; i < this.answer_items.length; i++) {
            this.answer_items[i].style.visibility = "visible";
        }
        //画面切り替え

        this.answer_explain.style.visibility = "hidden";

        if(this.user_answer == 1){
        
            this.answer_correct.style.visibility = "visible";
            this.answer_wrong.style.visibility = "hidden";
            //答えセット　タイトル画像を【正解】に変える

            this.correct_number += 1;
        }else if(this.user_answer == 0){
            this.answer_correct.style.visibility = "hidden";
            this.answer_wrong.style.visibility = "visible";
            //答えセット　タイトル画像を【不正解】に変える
        }

        //＝＝＝＝＝＝＝＝＝＝＝＝行数調整＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
        //横max：全角１３文字 縦max：７行
        var contents_length = this.order_arg.length;
        var number_of_br = this.order_arg.match(/<br>/g).length;
    
        number_of_br = number_of_br ? number_of_br:0; // 3項演算　【条件式 ? TRUE : FALSE;】(matchしなかった場合に備える)

        var newlines = Math.floor(contents_length/13) + number_of_br; // 行数を調べる
        
        switch(newlines){
            case 1:
                this.order_arg = "<br><br><br><br>" + this.order_arg;
                break;
            case 2:
                this.order_arg = "<br><br><br>" + this.order_arg;
                break;
            case 3:
                this.order_arg = "<br><br>" + this.order_arg;
                break;
            case 4:
                this.order_arg = "<br>" + this.order_arg;
                break;
            case 5:
                this.order_arg = "<br>" + this.order_arg;
                break;
            case 6:
                this.order_arg = "<br>" + this.order_arg;
                break;
        }
        //===================THAT'S ALL========================================================================

        this.speech_answer.innerHTML = this.order_arg;

        this.middle_btn.addEventListener("click",()=>{
            this.do();
        },{once:true})

        this.order_index += 1;
        this.order_changed_flg = 2;
        //命令を一つ終えたため、命令インデックスを１つ増加

    }

    end(){
        if(this.innerfunc_consoleflg){
            console.log(`============================It is %c<<END>>`,`color:blue`);
        };

        this.answer_explain.style.visibility = "visible";
        this.answer_correct.style.visibility = "hidden";
        this.answer_wrong.style.visibility = "hidden";
        //title画像を変更

        this.middle_btn.innerHTML = "戻る";
        this.middle_btn.addEventListener("click",()=>{
            window.location.href = this.order_arg;
        });

        this.load_dialogue();
        //会話文を更新     

        this.dialogue_index += 1;
        //会話パックのインデックス番号を増加
       
        
        this.order_index += 1;
        this.order_changed_flg = 1;
        //命令を一つ終えたため、命令インデックスを１つ増加
    }
    

}   

class SiteSystem{
    constructor(){

        var answer_correct = document.getElementById("quiz_answer_correct");
        var answer_wrong = document.getElementById("quiz_answer_wrong");
        var answer_explain = document.getElementById("quiz_answer_explain");

        var speech_question = document.getElementById("question_contents");
        var speech_answer = document.getElementById("answer_contents");

        var btn1 = document.getElementById("btn1_contents");
        var btn2 = document.getElementById("btn2_contents");
        var btn3 = document.getElementById("btn3_contents");
        var btn4 = document.getElementById("btn4_contents");
        var btn_middle = document.getElementById("middle_btn_contents");
        var btns = [btn1,btn2,btn3,btn4,btn_middle];

        var number_of_question = document.getElementById("number_of_question");

        var widgets = [answer_correct,answer_wrong,answer_explain,speech_question,speech_answer,btns,number_of_question];

        this.make_orderboxs();

        var ds = new DialogueSystem(this.orderbox_first, widgets);
    }

    make_orderboxs(){

        /*
        ➀load
            "load" : 答え画面で、dialogueをフキダシに表示する。答えには「へびくいず」の画像を表示
        ➁next_question
            "next_question":次の問題へ遷移
                ["next_question", 問題文,[btn1の内容,TF_ind], [btn2の内容,TF_ind], [btn3の内容,TF_ind],[btn4の内容, TF_ind]]
                (TF_indには0:False, 1:Trueを入れて下さい。2を入れるとbtnイベントを無効化します)
        ➂answer
            "answer":問題の正誤を判定、解説の表示
                ["answer",解説文]
        */

        {//【初期命令ボックス】  横max：全角１３文字 縦max：７行
            this.dialogues_first = [
                "<br>ようこそ！【へびくいず】へ！<br>これからヘビのクイズをするよ！<br>何問正解できるでしょうか？",
                "<br><br><br>さぁ　クイズを始めましょう！",
                "これでクイズは終わりです。<br>#command_amount_of_question#問中、#command_correct_number#問正解です！<br>またねー!"
            ];

            this.orders_first = [
                ["load"],
                ["next"],

                ["next_question","ヘビは眠るでしょうか？<br>眠るならどうやって眠るでしょう？",["目を閉じている",0],["眠らない",0],["目を開けて眠る",1],["",2],"quiz_1.png"],
                ["answer","A.【目を開けて眠る】<br><br>ヘビはまぶたがありません。<br>眼球の表面にはうろこがあり、視力が低いです。<br>目を開けていても、目に影響が少ないのです。"],
                ["next_question","ヘビが持たない部位は<br>どれでしょう？",["目",0],["鼻",0],["口",0],["耳",1],"quiz_2.png"],
                ["answer","A.【耳】<br><br>ヘビは周囲の音を外耳から<br>キャッチして、鼓膜に伝える<br>機能がありません。"],
                ["next_question","ヘビが足のかわりとして<br>使っている部分はどこでしょう？",["お腹",0],["しっぽ",0],["肋骨",1],["",2],"quiz_3.png"],
                ["answer","A.【肋骨】<br><br>肋骨を動かして動きます。<br>この時、腹のウロコが滑り止めとなります。"],
                ["next_question","ヘビがどこで冬眠する<br>でしょう？",["土の中",1],["木の上",0],["洞窟の中",0],["",2],"quiz_4.png"],
                ["answer","A.【土の中】<br><br>ヘビは外の気温によって、<br>体温が変わります。<br>そのため温度変化が少ない<br>土の中で眠ります。"],
                ["next_question","この中でヘビに無い骨は<br>どれでしょうか？",["胸骨",1],["肋骨",0],["背骨",0],["",2],"quiz_5.png"],
                ["answer","A.【胸骨】<br><br>胸骨がないことで、<br>肋骨を広げて大きな獲物を<br>飲み込むのです。"],
                ["next_question","ヘビが舌を出すのは何のためでしょう？",["においを感じるため",1],["体温調節のため",0],["物の位置を調べるため",0],["",2],"quiz_6.png"],
                ["answer","A.【においを感じるため】<br><br>下でにおいの粒子をキャッチ<br>して周囲の状況を把握します"],
                ["next_question","ヘビに手足がないのは<br>どうして？",["進化したため",1],["退化したため",0],["",2],["",2],"quiz_7.png"],
                ["answer","A.【進化したため】<br><br>ヘビはトカゲの仲間から<br>進化したと言われています。",],
                ["next_question","ヘビはどうやって呼吸している？",["呼吸器官がある",0],["動いて呼吸をする",0],["肋骨を動かして呼吸<br>する",1],["",2],"quiz_8.png"],
                ["answer","A.【肋骨を動かして呼吸する】<br><br>体が細長い構造に適応した<br>結果、肋骨を使います。<br>横隔膜がなくてもスムーズに<br>呼吸できるよう進化したのです。"],
                ["next_question","食事した後にヘビがあくびするのはなぜ？",["眠いから",0],["顎を戻すため",1],["普通にあくび",0],["",2],"quiz_9.png"],
                ["answer","A.【顎を戻すため】<br><br>あごの関節を調整しています"],
                ["next_question","ヘビを追い払う有効な<br>手段の一つはなに？",["頭をたたく",0],["水をかける",1],["土をかける",0],["",2],"quiz_10.png"],
                ["answer","A.【水をかける】<br>変温動物なので、水を掛けると動きが鈍くなります。"],
                ["end","quiz1.html"]

            ];

            /*
            「クネクネ」「ニョロニョロ」と表現される動きをヘビができるのは、なぜ？
            １　昔から言われていたから
            ２　背骨の数が多いから

            A　背骨の数が多いから
            大体200～400もの背骨があり、関節が多いことからあのような体をくねらせた動きができるそう

            食事した後にヘビがあくびするのはなぜ？
            １　眠いから
            ２　顎を戻すため
            ３　普通にあくび

            A　顎を戻すため
            あごの関節を調整している

            ヘビを追い払う有効な手段の一つはなに？
            １　頭をたたく
            ２　水を掛ける
            ３　土をかける

            A　水をかける


            */
            
            this.orderbox_first = [this.dialogues_first,this.orders_first];
        }

    }

}

var system = new SiteSystem;


/*
エラー内容: string_command_list.forEach is not a function. (In 'string_command_list.forEach(command =>{//コマンド式テンプレートリテラル法
            
            switch(command[1]){//ここに、処理するコマンドを書く
                case "command_correct_number":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_correct_number#",this.correct_number);
                case "command_amount_of_question":
                    this.contents_of_speech = this.contents_of_speech.replace("#command_amount_of_question#",this.amount_of_question);
            }
        })', 'string_command_list.forEach' is undefined)

エラー位置: translate_command@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:348:36
load_dialogue@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:332:31
load_dialogue_4start@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:294:31
do@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:126:42
are_there_data@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:278:16
DialogueSystem@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:53:28
SiteSystem@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:825:36
global code@https://yamatoaita.github.io/quiz.github.io/quiz_main.js:910:14
*/