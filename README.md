# 環境構築
Dockerを利用し、以下の環境を構築していきます。
- Django
- Gunicorn
- React(Typescript)
- Nginx
- PostgreSQL

## 検証環境
- macOS Catalina 10.15.3
- Docker for Mac 2.2.0.3
- Python 3.8.1 (pyenv)

## Dockerとは
Dockerとは仮想コンテナツールです。
コンテナと呼ばれる仮想環境を用いてミドルウェアなどのサービスを実行することができます。  

### 特徴
- ホストの環境に依存しない
  - 仮想環境を利用するので依存関係などの干渉がなくなる
  - ソフトウェアなどのバージョンを固定できる
- 作成した仮想環境を用意に再利用できる
  - 仮想環境の設定がDockerfileというファイルに保存できる
  - 設定ファイルがあれば同じ環境を構築できる
- イメージと呼ばれる設定ファイルが多数用意されている
  - 自分で環境構築のコードを書く手間が減る
- コマンド一つでミドルウェアなどが簡単に用意できる 
  - NginxやMysqlなど主要なイメージは公開されている
- 複数サービスの連携が容易
  - データやネットワーク接続はコードを数行書くだけ
- 起動が高速
  - 仮想化によくある仮想OSの構築がないため速く起動できる

### 利用の手順
一般に、Docker Composeを用いてコンテナを動かしていきます。  
#### Docker Composeとは
Dockerをより便利に利用するためのツールです。  
特に複数のコンテナを動かす際、コマンドのみで行うと複雑になり、相互の連携も難しくなります。  
その課題を解決するのが、Docker Composeです。  

利用するには、アプリケーションで利用するサービスやその設定をYAMLファイル一つに記述します。これによって、各サービス間の関連を含め、どのような環境を構築しているのか理解しやすくなります。

## インストール
### Docker for Mac
DockerをMacで利用するため、Docker for Mac をインストールしていきます。  
ここではターミナルからインストールしますが、公式サイトから行ってもそれ以降の手順は同じです。

```Shell
# HomebrewでGUIアプリをインストール
$ brew cask install docker

# Dockerを開き、アカウント登録、ログインを行う
$ open /Applications/Docker.app
```
以上でTerminalからDockerを実行できるようになりました。  
できない場合、Docker.appが動作していない可能性があります。
### pyenv, Python
#### pyenvとは
Pythonバージョン管理ツールです。  
ホスト(Mac)上のPythonのバージョンをコマンド一つで切り替えることができ、ディレクトリ(local)毎に使い分けることもできます。

利用まで以下の手順で行います。
1. pyenvのインストール
2. Pythonのインストール
3. 利用設定の記述
4. 開発で利用するPythonを指定する
```Shell
# Homebrewでインストール
$ brew install pyenv

# 利用可能なPythonのバージョンを確認
$ pyenv install -l

# 現時点で最新のバージョンをインストール
$ pyenv install 3.8.1

# 利用設定 (~/.bashrcに以下を記述)
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(pyenv init -)"' >> ~/.bashrc

$ source ~/.bashrc # 設定を反映させる

# 適当な名前でディレクトリを作成し移動
$ mkdir django-on-docker && cd $_ # '$_'は直前の引数

# このディレクトリで利用するPythonバージョンを設定
$ pyenv local 3.8.1
```
以上で、Pythonを利用する準備が整いました。

### Pipenv 
#### Pipenvとは
仮想環境を構築できるパッケージ管理ツールです。  
開発で必要なパッケージを、システム全体にインストールすることなく利用することができます。  
ただ今回の場合、Dockerは既に仮想環境を構築しているので、コンテナ内でパッケージインストールを行う際には、システムインストールを行う設定にします。

ここでは、以下の手順を追います。
1. Pipenvのインストール
2. Pipenvの利用設定
3. Djangoのインストール
4. Djangoのプロジェクト作成

尚、Djangoのインストールは最終的にDockerで行う設定にします。ここではDjango用ファイル(Project)生成のためにインストールを行います。

```Shell
$ pip install pipenv

# 仮想環境パスをカレントディレクトリに作成する設定
$ export PIPENV_VENV_IN_PROJECT=true

# 使用するPythonバージョンを指定
$ pipenv --python 3.8.1 

# 仮想環境にインストール
$ pipenv install django==2.2.11 

# 仮想環境内でDjangoプロジェクトを作成
$ pipenv run django-admin.py startproject myproject .
```

## Docker Compose
いよいよDocker Compose を記述していきます。
大まかに以下の手順です。
1. Dockerfileを作成する
2. docker-compose.ymlにDockerfileのパスを記述する

### Dockerfile
```Shell
# DjangoのDockerfile用のディレクトリを作成します
$ makedir app

# Dockerfileを作成します
$ vi app/Dockerfile
```
app/Dockerfile
```Dockerfile
# Docker Hub からイメージを指定
FROM python:3.8.2-alpine

# 作業ディレクトリを指定
WORKDIR /usr/src/app

# pipenvインストールをシステム上で行う
ENV PIPENV_SYSTEM 1

# pipenvインストール
COPY Pipfile Pipfile.lock /usr/src/app/
RUN pip install --upgrade pip && pip install pipenv \
  && pipenv install --deploy

COPY . /usr/src/app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### docker-compose.yml
次にdocker-compose.ymlを作成します。  
```YAML
version: '3.7'

services:
  app:  # サービス名(Docker上でこの名前が利用できます)
    build: ./app  # Dockerfileのパス
    volumes:  # コンテナ内データを存続させる
      - ./app/:/usr/src/app/
    ports:
      - 8000:8000
    env_file:  # 環境変数設定ファイルを指定
      - ./.env
```
これをベースにサービスを追加していきます。

## PostgreSQL 
- インストールと依存関係の記述  
docker-compose.yml
```YAML
services:
  app:
  
  ...
  
    depends_on:
      - db
  db:
    image: postgres:12.2-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_DB=myproject_dev
    env_file:
      - ./.env
volumes:
  postgres_data:
```
- psycopg2-binaryのインストール  
app/Pipfile
```Pipfile
  ...
  
[packages]
psycopg2-binary = "==2.8.4"
Django = "==2.2.11"

  ...
```
- psycopg2依存パッケージインストール  
app/Dockerfile
```Dockerfile
  ...
  
RUN apk update && apk add \
  postgresql-dev \
  gcc \
  python3-dev \
  musl-dev
  
  ...
```
- 環境変数設定  
.env
```env
# Django側の設定
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=(任意のDB名)
SQL_USER=**** (任意のユーザ)
SQL_PASSWORD= ****
SQL_HOST=db
SQL_PORT=5432

# PostgreSQL側の設定
POSTGRES_USER=**** 
POSTGRES_PASSWORD=****
```
- PostgreSQLを利用する宣言  
app/myproject/setting.py
```Python
  ...
  
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}
  ...
```

## Nginx 
- インストールと依存関係の記述  
docker-compose.yml
```YAML
  ...
  
  web:
    image: nginx:1.17.9-alpine
    ports:
      - 8080:80
    depends_on:
      - app
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
  ...
```
- 設定ファイル作成  
nginx/default.conf
```Nginx
upstream django {
    server app:8000;
}

server {

    listen 80;

    location / {
        proxy_pass http://django;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
    }

}
```

## Gunicorn 
- gunicornのインストール  
app/Pipfile
```Pipfile
[packages]
gunicorn = "==20.0.4"
psycopg2-binary = "==2.8.4"
Django = "==2.2.11"
```
- ビルトインサーバから置き換える
app/Dockerfile
```Dockerfile
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## React
簡単に環境構築ができるcreate-react-app(公式推奨)を利用していきます。
- DockerでNode.jsコンテナを立てる  
app/Dockerfile
```Dockerfile
  ...
  
  frontend:
    build: ./frontend
    volumes:
      - ./:/usr/src/
    ports:
      - 3000:3000
    environment:
      - NODE_ENV=development
  ...
```
- コンテナ内に開発環境を作成する
```Shell
$ docker-compose exec frontend npx create-react-app react-ts --typescript
```

## Staticファイル
最後に静的ファイルを設定します。  
- STATIC_ROOTの設定  
app/myproject/setting.py
```Python
  ...
  
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
```
- 静的ファイルを生成する
```Shell
$ docker-compose exec app python manage.py collectstatic
```
- ボリュームを設定する  
docker-compose.yml
```YAML
  web:
    ...
    
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - static:/usr/src/app/static
  app:
    build: ./app
    volumes:
      - ./app/:/usr/src/app/
      - static:/usr/src/app/static
      
    ...
  
  volumes:
  postgres_data:
  static:
  ```
  
  - 静的ファイルの場所を指定する  
  nginx/default.conf
  ```Nginx
    ...
    
    location /static/ {
        alias /usr/src/app/static/;
    }

}
```

以上で、大まかな環境構築が終了です。以下のコマンドで動作確認しましょう。
```Shell
$ docker-compose build
$ docker-compose up -d

# エラーが発生したらログを確認しましょう。
$ docker-compose logs -f
```
