# 環境構築
以下のコマンドでredisをローカルに落としてきてください
$ docker run --rm -p 6379:6379 redis
$ docker run -it --rm --net host redis redis-cli -h localhost -p 6379 
